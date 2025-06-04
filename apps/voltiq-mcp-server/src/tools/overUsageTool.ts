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

export function registerHighUsageTool(server: McpServer, collection: Collection) {
  server.tool(
    "get_high_power_usage_records",
    "查詢所有 usage > 2000 的用電紀錄，包含日期與時間。",
    {},
    async () => {
      try {
        console.log("Tool 'get_high_power_usage_records' called.");

        const highUsageRecords: { date: string; time: string; usage: number }[] = [];
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

          for (const record of doc.usageData) {
            if (record && typeof record.usage === "number" && record.usage > 2000) {
              highUsageRecords.push({
                date: doc.date,
                time: record.time,
                usage: Math.round(record.usage * 100) / 100
              });
            } else if (record && typeof record.usage !== "number") {
              console.warn(`Skipping invalid usage record in ${doc.date}:`, record);
            }
          }
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

        if (highUsageRecords.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "找不到 usage 超過 2000 的用電紀錄。"
              }
            ]
          };
        }

        const summaryText = [
          "高用電紀錄：",
          ...highUsageRecords.map(record => `${record.date} ${record.time}: ${record.usage} kWh`)
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
        console.error("Error during 'get_high_power_usage_records' execution:", error);
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
