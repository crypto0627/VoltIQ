import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Collection } from "mongodb";
import { z } from "zod";

interface UsageRecord {
  time: string;
  usage: number;
}

interface PowerUsageData {
  date: string; // e.g., "04/01"
  usageData: UsageRecord[];
}

export function registerDailyPowerUsageTool(
  server: McpServer,
  collection: Collection,
) {
  server.tool(
    "get_power_usage_by_time_range",
    "查詢指定日期與時間區間的用電資料。",
    {
      date: z.string().describe("日期，格式為 MM/DD，例如 '04/01'"),
      startTime: z.string().describe("開始時間，格式為 HH:mm，例如 '08:00'"),
      endTime: z.string().describe("結束時間，格式為 HH:mm，例如 '10:00'"),
    },
    async (input: { date: string; startTime: string; endTime: string }) => {
      try {
        const { date, startTime, endTime } = input;

        const result = await collection.findOne<PowerUsageData>({ date });

        if (!result) {
          return {
            content: [
              {
                type: "text",
                text: `找不到 ${date} 的用電資料。`,
              },
            ],
          };
        }

        const usageInRange = result.usageData.filter((entry) => {
          return entry.time >= startTime && entry.time <= endTime;
        });

        if (usageInRange.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `在 ${date} 的 ${startTime} 到 ${endTime} 間找不到用電資料。`,
              },
            ],
          };
        }

        const totalUsage =
          Math.round(
            usageInRange.reduce((sum, entry) => sum + entry.usage, 0) * 100,
          ) / 100;

        const summaryText = [
          `日期: ${date}`,
          `時間區間: ${startTime} - ${endTime}`,
          "用電資料:",
          ...usageInRange.map((entry) => `${entry.time}: ${entry.usage} kWh`),
          `\n總用電量: ${totalUsage} kWh`,
        ].join("\n");

        return {
          content: [
            {
              type: "text",
              text: summaryText,
            },
          ],
        };
      } catch (error) {
        console.error(
          "Error during 'get_power_usage_by_time_range' execution:",
          error,
        );
        return {
          content: [
            {
              type: "text",
              text: `執行工具時發生錯誤: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );
}
