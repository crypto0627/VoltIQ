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

export function registerMonthlyUsageSummaryTool(server: McpServer, collection: Collection) {
  server.tool(
    "get_monthly_power_usage_summary",
    "取得某個月份的每日總用電量。",
    {},
    async () => {
      try {
        console.log("Tool 'get_monthly_power_usage_summary' called.");

        const monthlyUsageMap: Record<string, number> = {};

        let docCount = 0;

        const cursor = collection.find<PowerUsageData>({});
        for await (const doc of cursor) {
          docCount++;

          if (!doc || typeof doc.date !== "string" || !Array.isArray(doc.usageData)) {
            console.warn("Skipping document with invalid format:", doc);
            continue;
          }

          const match = doc.date.match(/^(\d{2})\/\d{2}$/);
          if (!match) {
            console.warn(`Skipping document with invalid date format: ${doc.date}`);
            continue;
          }

          const month = match[1];
          if (!(month in monthlyUsageMap)) {
            monthlyUsageMap[month] = 0;
          }

          let dailyTotal = 0;
          for (const record of doc.usageData) {
            if (record && typeof record.usage === "number") {
              dailyTotal += record.usage;
            } else {
              console.warn(`Skipping invalid usage record in ${doc.date}:`, record);
            }
          }

          monthlyUsageMap[month] += dailyTotal;
        }

        if (docCount === 0) {
          return {
            content: [
              {
                type: "text",
                text: "找不到用電資料。"
              }
            ]
          };
        }

        const monthlyUsageSummary = Object.entries(monthlyUsageMap).map(([month, total]) => ({
          month,
          totalUsage: Math.round(total * 100) / 100
        }));

        const summaryText = [
          "每月用電量：",
          ...monthlyUsageSummary.map(e => `${e.month}月: ${e.totalUsage} kWh`)
        ].join("\n");

        return {
          content: [
            {
              type: "text",
              text: summaryText
            }
          ]
        };

      } catch (error) {
        console.error("Error during 'get_monthly_power_usage_summary' execution:", error);
        return {
          content: [
            {
              type: "text",
              text: `執行工具時發生錯誤: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );
}
