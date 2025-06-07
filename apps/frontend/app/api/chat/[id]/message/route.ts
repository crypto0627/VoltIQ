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
  const params = await context.params;
  const chatId: string = params.id;
  const { messages: incomingMessages } = await req.json();
  const latestUserMessage = incomingMessages?.[incomingMessages.length - 1];

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

  await prisma.message.create({
    data: {
      chatId,
      role: "user",
      content: latestUserMessage.content,
    },
  });

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

    const systemPrompt = [
      `You are a helpful AI assistant specialized in analyzing power usage data.`,
      `Available tools:`,
      `- get_daily_power_usage_by_month: 取得指定月份的每日總用電量。 Requires 'month' parameter (two-digit string, e.g., '01' for January).`,
      `- get_power_usage_by_time_range: 查詢指定日期與時間區間的用電資料。 Requires 'date' (MM/DD), 'startTime' (HH:mm), and 'endTime' (HH:mm) parameters.`,
      `- get_high_power_usage_records: 查詢所有 usage > 2000 的用電紀錄，包含日期與時間。 Takes no parameters.`,
      `- get_yearly_power_usage_summary: 統計所有月份的總用電量（共 12 個月），並顯示全年總和。 Takes no parameters.`,
      ``,
      `When the user asks a question, determine which tool is appropriate based on the keywords and required information in the query.`,
      `Instructions for tool usage:`,
      `1.  If the user asks for the daily power usage of a specific month (e.g., "一月的用電資料", "四月的用電", "給我03月的日用電"), use the \`get_daily_power_usage_by_month\` tool. Extract the month and convert it to a two-digit string ("一月" or "January" -> "01", "二月" or "February" -> "02", etc.).`,
      `2.  If the user asks for power usage data for a specific date and time range (e.g., "04/01早上8點到10點的用電", "查詢05/15 14:00到16:30的用電量"), use the \`get_power_usage_by_time_range\` tool. Extract the 'date' (MM/DD), 'startTime' (HH:mm), and 'endTime' (HH:mm). Ensure times are in 24-hour format.`,
      `3.  If the user asks to find records with usage greater than 2000 (e.g., "找出高用電紀錄", "哪些時段用電量超過2000?", "查詢異常高用電量"), use the \`get_high_power_usage_records\` tool. This tool requires no parameters.`,
      `4.  If the user asks for a summary of monthly or yearly total power usage (e.g., "今年每月用電量總和", "全年總用電量", "給我用電量統計"), use the \`get_yearly_power_usage_summary\` tool. This tool requires no parameters.`,
      ``,
      `**Data Analysis Instructions:**`,
      `If the user's message contains keywords like "分析", "總結", "建議", "分析數據", "統整", it indicates a request for data analysis.`,
      `In such cases:`,
      `a. First, identify which data needs to be analyzed based on the context.`,
      `b. Call the appropriate tool(s) to gather comprehensive data.`,
      `c. After retrieving the data, perform the following analysis:`,
      `   - Calculate key statistics (mean, median, max, min)`,
      `   - Identify patterns and trends`,
      `   - Compare with historical data if available`,
      `   - Highlight significant findings`,
      `   - Provide actionable insights and recommendations`,
      `d. Present the analysis in a structured format:`,
      `   1. Data Overview`,
      `   2. Key Findings`,
      `   3. Patterns and Trends`,
      `   4. Recommendations`,
      ``,
      `**Chart Generation Instructions:**`,
      `If the user's message contains keywords like "生成圖表", "數據圖", "圖", "chart", "圖表", it indicates a request to visualize data.`,
      `In such cases:`,
      `a. First, identify which data the user wants charted (e.g., daily usage for a month, yearly summary, high usage).`,
      `b. Call the appropriate tool to retrieve the required data (e.g., \`get_daily_power_usage_by_month\` for monthly daily data).`,
      `c. After successfully retrieving the data from the tool, process the tool's response to prepare the data in a format suitable for charting with libraries like Recharts. Determine the most suitable chart type (e.g., line chart for time series, bar chart for monthly comparison).`,
      `d. Return the processed, chart-ready data to the frontend. Be specific about the format you are returning for charting. Note: The current tools return text, so parsing will be required.`,
      ``,
      `General Guidelines:`,
      `- Always provide the necessary parameters for the chosen tool.`,
      `- Make multiple tool calls if needed to fully address the user's query.`,
      `- If a tool call fails or returns no data, inform the user clearly.`,
      `- Present the results from the tools in a user-friendly format and provide explanations where helpful.`,
    ].join("\n");

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...incomingMessages,
    ];

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

    let assistantResponseContent = "";

    const MAX_RETRIES = 3;
    let retryCount = 0;
    let result;

    while (retryCount < MAX_RETRIES) {
      try {
        result = await streamText({
          model: anthropic("claude-3-7-sonnet-20250219"),
          tools,
          messages,
          maxTokens: 4000,
          temperature: 0.3,
          onChunk: (chunk) => {
            if (chunk?.chunk?.type === "text-delta") {
              assistantResponseContent += chunk.chunk.textDelta;
            }
          },
          onStepFinish: (step) => {
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
            // Note: Specific retry logic for 529 is handled outside this onError callback
          },
          onFinish: async (finishResult) => {
            console.log("✅ Stream finished");
            console.log(
              "📝 Final response length:",
              assistantResponseContent.length,
            );

            // Only save the final assistant message after successful stream
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

        // If successful, break the retry loop
        break;
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);

        // Check for 529 error specifically. The error structure might vary, check error.cause or error.status
        // Assuming the error object might have a 'cause' with a 'status' or 'code' property for HTTP errors
        const isOverloadedError = (error as any)?.cause?.status === 529 || (error as any)?.status === 529 || (error as any)?.code === 529;

        if (isOverloadedError && retryCount < MAX_RETRIES - 1) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
        } else {
          // If not a 529 error or max retries reached, re-throw the error
          throw error;
        }
      }
    }

    // If the loop finishes without a successful result (e.g., threw error after max retries)
    if (!result) {
      throw new Error("Failed to stream text after multiple retries.");
    }

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
