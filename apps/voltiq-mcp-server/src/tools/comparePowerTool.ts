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

export function registerComparePowerUsageTool(
  server: McpServer,
  collection: Collection,
) {
  server.tool(
    "compare_power_usage",
    "比較不同時間區間的用電資料。可以比較兩個月份、兩個日期或兩個時間區間的用電情況。",
    {
      comparisonType: z
        .enum(["month", "date", "timeRange"])
        .describe("比較類型：month(月份)、date(日期)或timeRange(時間區間)"),
      firstPeriod: z
        .string()
        .describe(
          "第一個時間段，根據comparisonType格式不同：\n- month: 'MM' (例如 '10')\n- date: 'MM/DD' (例如 '10/01')\n- timeRange: 'MM/DD HH:mm-HH:mm' (例如 '10/01 08:00-10:00')",
        ),
      secondPeriod: z.string().describe("第二個時間段，格式與firstPeriod相同"),
    },
    async (input: {
      comparisonType: "month" | "date" | "timeRange";
      firstPeriod: string;
      secondPeriod: string;
    }) => {
      try {
        const { comparisonType, firstPeriod, secondPeriod } = input;

        // 解析時間段
        const parseTimeRange = (period: string) => {
          if (comparisonType === "timeRange") {
            const [date, timeRange] = period.split(" ");
            const [startTime, endTime] = timeRange.split("-");
            return { date, startTime, endTime };
          }
          return { date: period, startTime: "00:00", endTime: "23:45" };
        };

        const firstRange = parseTimeRange(firstPeriod);
        const secondRange = parseTimeRange(secondPeriod);

        // 獲取兩個時間段的數據
        const getDataForPeriod = async (range: {
          date: string;
          startTime: string;
          endTime: string;
        }) => {
          let result;

          if (comparisonType === "month") {
            // 處理月份比較
            const month = range.date.padStart(2, "0");
            const cursor = collection.find<PowerUsageData>({});
            const docs = await cursor.toArray();

            const monthDocs = docs.filter((doc) => {
              const match = doc.date.match(/^(\d{2})\/\d{2}$/);
              return match && match[1] === month;
            });

            if (monthDocs.length === 0) return null;

            // Aggregate daily usage for the month
            const dailyAggregates = new Map<string, number>(); // Key: 'MM/DD', Value: total daily usage

            monthDocs.forEach(doc => {
                const fullDate = doc.date; // e.g., "04/01"
                const day = fullDate.split('/')[1]; // Extract the day part
                const filteredUsageForDay = doc.usageData.filter(
                    (entry) => entry.time >= range.startTime && entry.time <= range.endTime
                );
                const totalUsageForDay = filteredUsageForDay.reduce((sum, entry) => sum + entry.usage, 0);
                dailyAggregates.set(day, (dailyAggregates.get(day) || 0) + totalUsageForDay); // Use day as key
            });

            const aggregatedUsageData: Array<{ date: string, usage: number }> = Array.from(dailyAggregates.entries()).map(([day, usage]) => ({
                date: day, // Use day here
                usage: Math.round(usage * 100) / 100
            }));

            const totalUsage =
                Math.round(
                    aggregatedUsageData.reduce((sum, entry) => sum + entry.usage, 0) * 100
                ) / 100;

            return {
                usageData: aggregatedUsageData, // Now this is daily aggregated data for the month
                totalUsage,
                period: range,
            };
          } else {
            // 處理日期和時間區間比較
            result = await collection.findOne<PowerUsageData>({
              date: range.date,
            });
            if (!result) return null;

            const usageInRange = result.usageData.filter((entry) => {
              return (
                entry.time >= range.startTime && entry.time <= range.endTime
              );
            });

            if (usageInRange.length === 0) return null;

            const totalUsage =
              Math.round(
                usageInRange.reduce((sum, entry) => sum + entry.usage, 0) * 100,
              ) / 100;

            return {
              usageData: usageInRange,
              totalUsage,
              period: range,
            };
          }
        };

        const [firstData, secondData] = await Promise.all([
          getDataForPeriod(firstRange),
          getDataForPeriod(secondRange),
        ]);

        if (!firstData || !secondData) {
          return {
            content: [
              {
                type: "text",
                text: `無法找到完整的比較數據。請確認輸入的時間段是否正確。`,
              },
            ],
          };
        }

        // Helper to format period for text and chart labels
        const formatPeriod = (data: typeof firstData) => {
          if (comparisonType === "month") {
            return `${data.period.date}月`;
          } else if (comparisonType === "date") {
            return data.period.date;
          } else {
            return `${data.period.date} ${data.period.startTime}-${data.period.endTime}`;
          }
        };

        // 計算總用電量差異和百分比變化
        const difference =
          Math.round((secondData.totalUsage - firstData.totalUsage) * 100) /
          100;
        const percentageChange =
          Math.round((difference / firstData.totalUsage) * 10000) / 100;

        // 準備圖表數據 for LineChart (two lines)
        let allKeys = new Set<string>();
        let xAxisKey: 'time' | 'date' | 'day';

        if (comparisonType === 'month') {
            xAxisKey = 'day';
            firstData.usageData.forEach((d: any) => allKeys.add(d.date));
            secondData.usageData.forEach((d: any) => allKeys.add(d.date));
        } else {
            xAxisKey = 'time';
            firstData.usageData.forEach((d: any) => allKeys.add(d.time));
            secondData.usageData.forEach((d: any) => allKeys.add(d.time));
        }

        const sortedKeys = Array.from(allKeys).sort((a, b) => {
            if (xAxisKey === 'day') {
                return parseInt(a, 10) - parseInt(b, 10);
            } else if (xAxisKey === 'time') {
                const [h1, m1] = a.split(':').map(Number);
                const [h2, m2] = b.split(':').map(Number);
                if (h1 !== h2) return h1 - h2;
                return m1 - m2;
            }
            return a.localeCompare(b);
        });

        const firstPeriodMap = new Map<string, number>();
        if (comparisonType === 'month') {
            firstData.usageData.forEach((d: any) => firstPeriodMap.set(d.date, d.usage));
        } else {
            firstData.usageData.forEach((d: any) => firstPeriodMap.set(d.time, d.usage));
        }


        const secondPeriodMap = new Map<string, number>();
        if (comparisonType === 'month') {
            secondData.usageData.forEach((d: any) => secondPeriodMap.set(d.date, d.usage));
        } else {
            secondData.usageData.forEach((d: any) => secondPeriodMap.set(d.time, d.usage));
        }

        const detailedFirstPeriodUsage = sortedKeys.map(key => {
            const usage = firstPeriodMap.get(key) || 0;
            return `${xAxisKey === 'time' ? '時間' : (xAxisKey === 'day' ? '日' : '日期')}: ${key}, 用電量: ${usage.toFixed(2)} kW`;
        }).join("\n");

        const detailedSecondPeriodUsage = sortedKeys.map(key => {
            const usage = secondPeriodMap.get(key) || 0;
            return `${xAxisKey === 'time' ? '時間' : (xAxisKey === 'day' ? '日' : '日期')}: ${key}, 用電量: ${usage.toFixed(2)} kW`;
        }).join("\n");


        // Generating comparison text with detailed usage
        const finalComparisonText = [
          `比較結果：`,
          `第一段時間：${formatPeriod(firstData)}`,
          `總用電量：${firstData.totalUsage} kW`,
          `\n第一段時間用電詳情：`,
          detailedFirstPeriodUsage,
          `\n第二段時間：${formatPeriod(secondData)}`,
          `總用電量：${secondData.totalUsage} kW`,
          `\n第二段時間用電詳情：`,
          detailedSecondPeriodUsage,
          `\n差異分析：`,
          `用電量差異：${difference > 0 ? "+" : ""}${difference} kW`,
          `變化百分比：${percentageChange > 0 ? "+" : ""}${percentageChange}%`,
        ].join("\n");

        const chartData = sortedKeys.map(key => ({
            [xAxisKey]: key,
            firstPeriodUsage: firstPeriodMap.get(key) || 0,
            secondPeriodUsage: secondPeriodMap.get(key) || 0,
        }));

        const chartConfig = {
          xAxisDataKey: xAxisKey,
          line1DataKey: "firstPeriodUsage",
          line2DataKey: "secondPeriodUsage",
          line1Name: formatPeriod(firstData),
          line2Name: formatPeriod(secondData),
          tooltipLabel: xAxisKey === 'time' ? "時間" : (xAxisKey === 'day' ? "日" : "日期"),
          tooltipValueLabel: "用電量",
        };

        return {
          content: [
            {
              type: "text",
              text: finalComparisonText,
            },
          ],
          chartData: chartData,
          chartType: "Compare-LineChart",
          chartConfig: chartConfig,
        };
      } catch (error) {
        console.error("Error during 'compare_power_usage' execution:", error);
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
