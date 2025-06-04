import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { experimental_createMCPClient, streamText } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";
import { anthropic } from "@ai-sdk/anthropic";

interface Context {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, context: Context) {
  const { id: chatId } = context.params;
  const { content } = await req.json();

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  // 先把使用者訊息存進資料庫
  const userMessage = await prisma.message.create({
    data: {
      chatId,
      role: "user",
      content,
    },
  });

  // 取得歷史訊息（包含剛存的）
  const messageHistory = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  const formattedMessages = messageHistory.map((msg) => ({
    role: msg.role.toLowerCase() as "user" | "assistant" | "system",
    content: msg.content,
  }));

  // 初始化 MCP transport/client
  const transport = new Experimental_StdioMCPTransport({
    command: "node",
    args: ["/Users/jakekuo/code/fortune/VoltIQ/apps/voltiq-mcp-server/build/index.js"],
  });

  const client = await experimental_createMCPClient({ transport });
  const tools = await client.tools();

  const systemPrompt = [
    `You are a helpful AI assistant specialized in analyzing power usage data.`,
    `Guidelines:`,
    `1. Check both monthly and time slot over usage data when relevant`,
    `2. Make multiple tool calls if needed for complete information`,
    `3. For monthly requests, check both regular and over usage data`,
    `4. Combine results from different tool calls for comprehensive responses`,
    `5. Provide clear explanations of the data analysis`
  ].join("\n");

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...formattedMessages,
    { role: "user" as const, content }
  ];

  // 用來累積 AI 回應字串
  let assistantResponseContent = "";

  try {
    const result = await streamText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      tools,
      messages,
      maxTokens: 4000,
      temperature: 0.7,
      onChunk: (chunk: any) => {
        // chunk.content 是每次接收到的文字片段
        if (chunk.content) {
          assistantResponseContent += chunk.content;
        }
      },
      onError: (error) => {
        console.error("Stream error:", error);
      },
      onStepFinish: (step) => {
        console.log("Tool call step finished:", step.toolCalls);
      },
      onFinish: async (result) => {
        console.log("Streaming finished. Final result:", result);
        // 這邊存 assistant 回應到資料庫
        await prisma.message.create({
          data: {
            chatId,
            role: "assistant",
            content: assistantResponseContent,
          },
        });
      },
    });

    const response = result.toDataStreamResponse();

    const reader = response.body?.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) return controller.close();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (err) {
          console.error("Streaming error:", err);
        } finally {
          controller.close();
          // 等 stream 結束後，存助理訊息
          await prisma.message.create({
            data: {
              chatId,
              role: "assistant",
              content: assistantResponseContent,
            },
          });

          await client.close();
          await transport.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error) {
    console.error("❌ Error in message processing:", error);
    await client.close();
    await transport.close();
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process message",
      },
      { status: 500 }
    );
  }
}
