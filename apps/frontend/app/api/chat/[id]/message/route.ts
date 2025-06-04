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
  // Access params directly as per Next.js App Router, despite the misleading error message
  const params = await context.params;
  const chatId: string = params.id;

  // The useChat hook sends the messages array in the request body
  const { messages: incomingMessages } = await req.json();

  // Find the latest user message to save to DB. It should be the last message.
  const latestUserMessage = incomingMessages?.[incomingMessages.length - 1];

  // Validate the incoming messages payload
  if (!incomingMessages || !Array.isArray(incomingMessages) || incomingMessages.length === 0 || !latestUserMessage || latestUserMessage.role !== 'user' || !latestUserMessage.content) {
    console.error("Invalid messages payload received:", incomingMessages);
    return NextResponse.json({ error: "Invalid messages payload" }, { status: 400 });
  }

  // Store user message in database
  await prisma.message.create({
    data: {
      chatId,
      role: "user",
      content: latestUserMessage.content,
    },
  });

  // Initialize MCP transport/client
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

  // Use the incoming messages array directly, prepending the system prompt
  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...incomingMessages
  ];

  // Accumulate AI response string
  let assistantResponseContent = "";

  try {
    const result = await streamText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      tools,
      messages,
      maxTokens: 4000,
      temperature: 0.7,
      onChunk: (chunk) => {
        if (chunk?.chunk?.type === "text-delta") {
          assistantResponseContent += chunk.chunk.textDelta;
        }
      },
      onError: (error) => {
        console.error("Stream error:", error);
      },
      onFinish: async () => {
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
          // Store assistant message after stream ends
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
