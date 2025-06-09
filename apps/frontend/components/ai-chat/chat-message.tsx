import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import type { Message } from "@/types/ui/ai-chat-type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// 擴展 Message 類型以包含工具調用信息和可能的圖表數據
interface ExtendedMessage extends Message {
  toolInvocations?: Array<{
    toolCallId: string;
    toolName: string;
    args: any;
    state: "partial-call" | "call" | "result" | "error";
    result?: any; // Tool result might contain { content: [...], chartData: [...], chartType: string, chartConfig: {...} }
  }>;
  // Consider adding a dedicated field for chart data if toolInvocations is not suitable for direct consumption
  // chartData?: any;
  // chartType?: string;
  // chartConfig?: any;
}

export function ChatMessage({ message }: { message: ExtendedMessage }) {
  // Helper function to find chart data in tool results
  const getChartData = () => {
    if (message.toolInvocations && message.toolInvocations.length > 0) {
      for (const invocation of message.toolInvocations) {
        // Check for successful tool calls with results
        if (invocation.state === "result" && invocation.result) {
          // Check if the result has the expected chart data structure
          if (invocation.result.chartData && Array.isArray(invocation.result.chartData)) {
            return {
              data: invocation.result.chartData,
              type: invocation.result.chartType || "BarChart", // Default to BarChart if type is missing
              config: invocation.result.chartConfig || {}
            };
          }
        }
      }
    }
    return null; // No chart data found
  };

  // 處理工具調用結果的格式化
  const formatToolResult = (result: any): string => {
    if (!result) return "";

    try {
      // If it contains chart data, format only the text content part
      if (result.chartData && Array.isArray(result.chartData)) {
         if (result.content && Array.isArray(result.content)) {
            return result.content
              .filter((item: any) => item.type === "text")
              .map((item: any) => item.text)
              .join("\n");
         }
         return ""; // If chart data is present but no text content, return empty string for text part
      }

      // If result has content array
      if (result.content && Array.isArray(result.content)) {
        return result.content
          .filter((item: any) => item.type === "text")
          .map((item: any) => item.text)
          .join("\n");
      }

      // If result is direct text
      if (typeof result === "string") {
        return result;
      }

      // If result is object, try to extract text content
      if (typeof result === "object") {
        if (result.text) return result.text;
        if (result.message) return result.message;
        // Try JSON formatting as a fallback, but prefer not to show raw JSON for charts
        // return JSON.stringify(result, null, 2);
      }

      return String(result);
    } catch (error) {
      console.error("Error formatting tool result:", error);
      return "Error formatting result";
    }
  };

  // 通用格式化函数 - 检测并格式化各种数据类型
  const formatGenericData = (text: string): string => {
    if (!text || typeof text !== "string") return text;

    try {
      // 按行分割文本
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      const formattedLines = lines.map((line) => {
        // 格式化数字数据行（包含数字和单位的行）
        const numberUnitMatch = line.match(
          /^([^:：]+)[：:]?\s*([\d,]+\.?\d*)\s*([A-Za-z]+|[^\d\s,\.]+)$/,
        );
        if (numberUnitMatch) {
          const label = numberUnitMatch[1];
          const value = parseFloat(numberUnitMatch[2].replace(/,/g, ""));
          const unit = numberUnitMatch[3];
          return `${label}: ${value.toLocaleString("zh-TW")} ${unit}`;
        }

        // 格式化百分比数据
        const percentMatch = line.match(
          /^([^:：]+)[：:]?\s*([\d,]+\.?\d*)\s*%/,
        );
        if (percentMatch) {
          const label = percentMatch[1];
          const value = parseFloat(percentMatch[2].replace(/,/g, ""));
          return `${label}: ${value.toLocaleString("zh-TW")}%`;
        }

        // 格式化金额数据
        const currencyMatch = line.match(
          /^([^:：]+)[：:]?\s*([￥$€£¥]?)\s*([\d,]+\.?\d*)\s*([￥$€£¥]?)/,
        );
        if (currencyMatch && (currencyMatch[2] || currencyMatch[4])) {
          const label = currencyMatch[1];
          const currency = currencyMatch[2] || currencyMatch[4];
          const value = parseFloat(currencyMatch[3].replace(/,/g, ""));
          return `${label}: ${currency}${value.toLocaleString("zh-TW")}`;
        }

        // 格式化日期时间数据
        const dateTimeMatch = line.match(
          /^([^:：]+)[：:]?\s*(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?[\s\d:時分秒]*)/,
        );
        if (dateTimeMatch) {
          const label = dateTimeMatch[1];
          const datetime = dateTimeMatch[2];
          return `${label}: ${datetime}`;
        }

        // 格式化总计/合计行（加粗显示）
        const totalMatch = line.match(
          /(总计|總計|合計|总共|總共|全年|全月|全日|总额|總額)[：:]?\s*(.+)/,
        );
        if (totalMatch) {
          return `**${line}**`;
        }

        // 保持原样
        return line;
      });

      return formattedLines.join("\n");
    } catch (error) {
      console.error("Error formatting generic data:", error);
      return text;
    }
  };

  // 渲染格式化的內容
  const renderFormattedContent = (content: string) => {
    // 按行分割並處理
    const lines = content.split("\n");

    return lines.map((line, index) => {
      // *** START: Added check for lines starting with "0:" ***
      if (line.trim().startsWith("0:")) {
         // Remove the "0:" prefix before rendering
         const formattedLine = line.trim().replace(/^0:\s*/, '');
         return (
            <div key={index} className="mb-2 text-slate-100"> {/* Render as normal line without prefix */}
               {formattedLine}
            </div>
         );
      }
      // *** END: Added check for lines starting with "0:" ***

      // 處理粗體文本（**text**）
      if (line.includes("**")) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        return (
          <div key={index} className="mb-2">
            {parts.map((part, partIndex) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <span key={partIndex} className="font-bold text-emerald-400">
                    {part.slice(2, -2)}
                  </span>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      }

      // 處理包含冒号的數據行（key-value 格式） - This was already removed

      // 處理列表項目（以 • - * 开头的行）
      // REMOVED: List item formatting logic

      // 處理數字編號列表（1. 2. 3. 开头的行）
      // REMOVED: Numbered list formatting logic

      // 空行
      if (!line.trim()) {
        return <div key={index} className="h-2" />;
      }

      // 普通行
      return (
        <div key={index} className="mb-2 text-slate-100"> {/* Added text color for clarity */}
          {line}
        </div>
      );
    });
  };

  const isUser = message.role === "user";
  const chartInfo = getChartData(); // Check for chart data

  // Get the full content from tool results, excluding chart data part
  const getFullContent = (): string => {
    let fullContent = message.content;

    // If there are tool call results, prefer displaying formatted tool results text
    if (message.toolInvocations && message.toolInvocations.length > 0) {
      const toolResultsText = message.toolInvocations
        .filter(
          (invocation) => invocation.state === "result" && invocation.result,
        )
        .map((invocation) => formatToolResult(invocation.result)) // Use formatToolResult to get only text part
        .filter((text) => text.length > 0);

      if (toolResultsText.length > 0) {
        // Format the combined text from tool results
        return formatGenericData(toolResultsText.join("\n\n"));
      }
    }

    // Fallback to raw message content if no tool results text
    return formatGenericData(fullContent);
  };
  const content = getFullContent(); // Get text content

  // Check if content contains any of the exclusion keywords
  const shouldExcludeChart = (
    content.includes('分析') || content.includes('analysis') ||
    content.includes('總結') || content.includes('summary') ||
    content.includes('統計') || content.includes('statistics') ||
    content.includes('建議') || content.includes('recommendation')
  );

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex-shrink-0">
          <AvatarFallback className="relative">
            <Image
              src="/ai-button.jpg"
              alt="AI Icon"
              fill
              className="text-white object-contain rounded-full border-4 border-blue-500/40"
            />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`
          max-w-[95%] rounded-xl p-3 sm:p-4 shadow-xl backdrop-blur-sm
          ${
            isUser
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white ml-auto"
              : "bg-slate-700/80 border border-slate-600/50 text-slate-100"
          }
        `}
      >
        {/* Render chart if data is available and not excluded by keywords */}
        {chartInfo && chartInfo.data && !shouldExcludeChart && (
           <div className="w-full h-64 sm:h-80 mb-4 rounded-lg overflow-hidden bg-slate-900/30"> {/* Container for the chart */}
              <ResponsiveContainer width="100%" height="85%">
                 {/* Determine and render the correct chart type directly */}
                 {chartInfo.type === "BarChart" ? (
                    <BarChart
                       data={chartInfo.data}
                       margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5,
                       }}
                    >
                       <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                       <XAxis dataKey={chartInfo.config.xAxisDataKey || 'date'} stroke="#e2e8f0" />
                       <YAxis stroke="#e2e8f0" tickFormatter={(value) => `${value.toLocaleString("zh-TW")} kW`} />
                       <Tooltip
                          cursor={{ fill: '#475569', opacity: 0.5 }}
                          contentStyle={{ backgroundColor: '#334155', border: 'none', borderRadius: '4px' }}
                          labelStyle={{ color: '#e2e8f0' }}
                          itemStyle={{ color: '#94a3b8' }}
                          formatter={(value: number, name: string) => [value.toLocaleString("zh-TW"), chartInfo.config.tooltipValueLabel || name]}
                          labelFormatter={(label: string) => `${chartInfo.config.tooltipLabel || ''}${label}`}
                       />
                       <Legend />
                       <Bar dataKey={chartInfo.config.barDataKey || 'totalUsage'} fill="#34d399" name={chartInfo.config.tooltipValueLabel || "用電量"} />
                    </BarChart>
                 ) :
                 (
                    <LineChart
                       data={chartInfo.data}
                       margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5,
                       }}
                    >
                       <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                       <XAxis dataKey={chartInfo.config.xAxisDataKey || 'time'} stroke="#e2e8f0" />
                       <YAxis stroke="#e2e8f0" tickFormatter={(value) => `${value.toLocaleString("zh-TW")} kW`} />
                       <Tooltip
                           contentStyle={{ backgroundColor: '#334155', border: 'none', borderRadius: '4px' }}
                           labelStyle={{ color: '#e2e8f0' }}
                           itemStyle={{ color: '#94a3b8' }}
                            formatter={(value: number, name: string) => [value.toLocaleString("zh-TW"), chartInfo.config.tooltipValueLabel || name]}
                           labelFormatter={(label: string) => `${chartInfo.config.tooltipLabel || ''}${label}`}
                       />
                       <Legend />
                       <Line type="monotone" dataKey={chartInfo.config.lineDataKey || 'usage'} stroke="#34d399" activeDot={{ r: 5, fill: '#34d399', stroke: '#e2e8f0' }} name={chartInfo.config.tooltipValueLabel || "用電量"} />
                    </LineChart>
                 )}
                 {/* Add other chart types here as needed */}
              </ResponsiveContainer>
           </div>
        )}

        {/* Render text content below the chart (or alone if no chart) */}
        {content && <div className="space-y-2">{renderFormattedContent(content)}</div>}

        {/* 顯示工具調用信息（調試用，可選） */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-600/30">
            <div className="text-xs text-slate-400">
              使用了工具:{" "}
              {message.toolInvocations.map((inv) => inv.toolName).join(", ")}
            </div>
          </div>
        )}

        <div className="text-xs text-slate-400 mt-2 opacity-60">
          {new Date(message.timestamp).toLocaleTimeString("zh-TW", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex-shrink-0">
          <AvatarFallback className="relative bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

