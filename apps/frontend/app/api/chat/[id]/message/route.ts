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
  // Access params directly as per Next.js App Router
  const params = await context.params;
  const chatId: string = params.id;

  // The useChat hook sends the messages array in the request body
  const { messages: incomingMessages } = await req.json();

  // Find the latest user message to save to DB
  const latestUserMessage = incomingMessages?.[incomingMessages.length - 1];

  // Validate the incoming messages payload
  if (
    !incomingMessages ||
    !Array.isArray(incomingMessages) ||
    incomingMessages.length === 0 ||
    !latestUserMessage ||
    latestUserMessage.role !== "user" ||
    !latestUserMessage.content
  ) {
    console.error("Invalid messages payload received:", incomingMessages);
    return NextResponse.json(
      { error: "Invalid messages payload" },
      { status: 400 },
    );
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
    args: [
      "/Users/jakekuo/code/fortune/VoltIQ/apps/voltiq-mcp-server/build/index.js",
    ],
  });

  let client: any;
  let tools;

  try {
    client = await experimental_createMCPClient({ transport });
    tools = await client.tools();

    // Debug: Log available tools
    console.log("🔧 Available MCP tools:", Object.keys(tools || {}));

    const systemPrompt = [
      `You are a helpful AI assistant specialized in analyzing power usage data.`,
      `Available tools and their usage:`,
      `- get_daily_power_usage_summary: Use this to get daily power usage data for a specific month`,
      ``,
      `When user requests monthly data (like "一月的用電資料" or "1月用電資料"):`,
      `1. Extract the month from user input`,
      `2. Call get_daily_power_usage_summary with the month parameter`,
      `3. The month parameter should be in format: "01" for January, "02" for February, etc.`,
      `4. Support Chinese month names: 一月=01, 二月=02, 三月=03, 四月=04, 五月=05, 六月=06, 七月=07, 八月=08, 九月=09, 十月=10, 十一月=11, 十二月=12`,
      ``,
      `Guidelines:`,
      `1. Always provide the month parameter when calling tools`,
      `2. Make multiple tool calls if needed for complete information`,
      `3. Provide clear explanations of the data analysis`,
      `4. If tool calls fail, explain what went wrong`,
    ].join("\n");

    // Use the incoming messages array directly, prepending the system prompt
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...incomingMessages,
    ];

    // Debug: Log the last few messages to understand context
    console.log(
      "💬 Recent messages:",
      messages.slice(-2).map((m) => ({
        role: m.role,
        content:
          typeof m.content === "string"
            ? m.content.substring(0, 100)
            : m.content,
      })),
    );

    // Accumulate AI response string
    let assistantResponseContent = "";

    const result = await streamText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      tools,
      messages,
      maxTokens: 4000,
      temperature: 0.3, // Lower temperature for more consistent tool usage
      onChunk: (chunk) => {
        if (chunk?.chunk?.type === "text-delta") {
          assistantResponseContent += chunk.chunk.textDelta;
        }
      },
      onStepFinish: (step) => {
        // Debug: Log tool calls and their results
        if (step.toolCalls && step.toolCalls.length > 0) {
          console.log(
            "🔧 Tool calls made:",
            step.toolCalls.map((tc) => ({
              toolName: tc.toolName,
              args: tc.args,
            })),
          );
        }
        if (step.toolResults && step.toolResults.length > 0) {
          console.log(
            "📊 Tool results:",
            step.toolResults.map((tr) => ({
              toolCallId: tr.toolCallId,
              result:
                typeof tr.result === "string"
                  ? tr.result.substring(0, 200)
                  : tr.result,
            })),
          );
        }
      },
      onError: (error) => {
        console.error("❌ Stream error:", error);
      },
      onFinish: async (finishResult) => {
        console.log("✅ Stream finished");
        console.log(
          "📝 Final response length:",
          assistantResponseContent.length,
        );

        // Save assistant response to database
        if (assistantResponseContent.trim()) {
          await prisma.message.create({
            data: {
              chatId,
              role: "assistant",
              content: assistantResponseContent,
            },
          });
        }
      },
    });

    const response = result.toDataStreamResponse();

    const reader = response.body?.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          console.warn("⚠️ No reader available");
          return controller.close();
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (err) {
          console.error("❌ Streaming error:", err);
        } finally {
          controller.close();

          // Cleanup
          try {
            await client?.close();
            await transport?.close();
            console.log("🧹 MCP client and transport closed");
          } catch (cleanupError) {
            console.error("❌ Cleanup error:", cleanupError);
          }
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

    // Enhanced error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Cleanup on error
    try {
      if (client) await client.close();
      if (transport) await transport.close();
    } catch (cleanupError) {
      console.error("❌ Cleanup error:", cleanupError);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process message",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
