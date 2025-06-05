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

export function registerDailyUsageByMonthTool(
  server: McpServer,
  collection: Collection,
) {
  server.tool(
    "get_daily_power_usage_by_month",
    "取得指定月份的每日總用電量。",
    {
      month: z.string().describe("欲查詢的月份 (兩位數字, e.g., 'January' is '01' , '一月' is '01'....)"),
    },
    async ({ month }) => {
      try {
        const dailyUsageMap: Record<string, number> = {};
        let docCountInMonth = 0;

        const cursor = collection.find<PowerUsageData>({});
        for await (const doc of cursor) {
          if (
            !doc ||
            typeof doc.date !== "string" ||
            !Array.isArray(doc.usageData)
          ) {
            console.warn("Skipping document with invalid format:", doc);
            continue;
          }

          const match = doc.date.match(/^(\d{2})\/\d{2}$/);
          if (!match) {
            console.warn(
              `Skipping document with invalid date format: ${doc.date}`,
            );
            continue;
          }

          const docMonth = match[1];

          if (docMonth === month) {
            docCountInMonth++;

            let dailyTotal = 0;
            for (const record of doc.usageData) {
              if (record && typeof record.usage === "number") {
                dailyTotal += record.usage;
              } else {
                console.warn(
                  `Skipping invalid usage record in ${doc.date}:`,
                  record,
                );
              }
            }

            dailyUsageMap[doc.date] = Math.round(dailyTotal * 100) / 100;
          }
        }

        if (docCountInMonth === 0) {
          return {
            content: [
              {
                type: "text",
                text: `找不到${month}月的用電資料。`,
              },
            ],
          };
        }

        const dailyUsageSummary = Object.entries(dailyUsageMap)
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .map(
            ([date, totalUsage]) => `${date}: ${totalUsage} kWh`,
          );

        const summaryText = [
          `${month}月每日用電量：`,
          ...dailyUsageSummary,
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
          "Error during 'get_daily_power_usage_by_month' execution:",
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
