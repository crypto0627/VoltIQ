import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import type { Message } from "@/types/ui/ai-chat-type";

interface ChatMessageProps {
  message: Message;
}

// 擴展 Message 類型以包含工具調用信息
interface ExtendedMessage extends Message {
  toolInvocations?: Array<{
    toolCallId: string;
    toolName: string;
    args: any;
    state: "partial-call" | "call" | "result" | "error";
    result?: any;
  }>;
}

export function ChatMessage({ message }: { message: ExtendedMessage }) {
  // 處理工具調用結果的格式化
  const formatToolResult = (result: any): string => {
    if (!result) return "";

    try {
      // 如果結果有 content 數組
      if (result.content && Array.isArray(result.content)) {
        return result.content
          .filter((item: any) => item.type === "text")
          .map((item: any) => item.text)
          .join("\n");
      }

      // 如果結果是直接的文本
      if (typeof result === "string") {
        return result;
      }

      // 如果結果是對象，嘗試提取文本內容
      if (typeof result === "object") {
        if (result.text) return result.text;
        if (result.message) return result.message;
        // 嘗試 JSON 格式化
        return JSON.stringify(result, null, 2);
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
    // 按行分割並処理
    const lines = content.split("\n");

    return lines.map((line, index) => {
      // 處理粗體文本（**text**）
      if (line.includes("**")) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        return (
          <div key={index} className="mb-2">
            {parts.map((part, partIndex) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <span key={partIndex} className="font-bold text-emerald-300">
                    {part.slice(2, -2)}
                  </span>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      }

      // 處理標題行（包含特定关键词的行）
      const titleKeywords = [
        "摘要",
        "總覽",
        "概況",
        "統計",
        "報告",
        "分析",
        "數據",
        "結果",
      ];
      if (titleKeywords.some((keyword) => line.includes(keyword))) {
        return (
          <div key={index} className="font-semibold text-teal-300 mb-3 text-lg">
            {line}
          </div>
        );
      }

      // 處理包含冒号的數據行（key-value 格式）
      if (line.includes(":") || line.includes("：")) {
        const colonIndex =
          line.indexOf(":") !== -1 ? line.indexOf(":") : line.indexOf("：");
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();

        return (
          <div
            key={index}
            className="flex justify-between items-center py-1 px-3 rounded bg-slate-800/30 mb-1"
          >
            <span className="text-cyan-300 font-medium">{key}</span>
            <span className="text-slate-200 font-mono">{value}</span>
          </div>
        );
      }

      // 處理列表項目（以 • - * 开头的行）
      if (line.match(/^[\s]*[•\-\*]\s/)) {
        return (
          <div key={index} className="ml-4 mb-1 text-slate-300">
            <span className="text-emerald-400 mr-2">•</span>
            {line.replace(/^[\s]*[•\-\*]\s/, "")}
          </div>
        );
      }

      // 處理數字編號列表（1. 2. 3. 开头的行）
      if (line.match(/^[\s]*\d+[\.\)]\s/)) {
        return (
          <div key={index} className="ml-4 mb-1 text-slate-300">
            <span className="text-teal-400 mr-2 font-medium">
              {line.match(/^[\s]*(\d+[\.\)])/)?.[1]}
            </span>
            {line.replace(/^[\s]*\d+[\.\)]\s/, "")}
          </div>
        );
      }

      // 空行
      if (!line.trim()) {
        return <div key={index} className="h-2" />;
      }

      // 普通行
      return (
        <div key={index} className="mb-1">
          {line}
        </div>
      );
    });
  };

  // 獲取完整的消息內容
  const getFullContent = (): string => {
    let fullContent = message.content;

    // 如果有工具調用結果，只顯示工具調用的結果，不顯示初始內容
    if (message.toolInvocations && message.toolInvocations.length > 0) {
      const toolResults = message.toolInvocations
        .filter(
          (invocation) => invocation.state === "result" && invocation.result,
        )
        .map((invocation) => formatToolResult(invocation.result))
        .filter((result) => result.length > 0);

      if (toolResults.length > 0) {
        // 只顯示工具調用結果，使用通用格式化
        const formattedResults = toolResults.map((result) =>
          formatGenericData(result),
        );
        return formattedResults.join("\n\n");
      }
    }

    return fullContent;
  };

  const isUser = message.role === "user";
  const content = getFullContent();

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex-shrink-0">
          <AvatarFallback>
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
          max-w-[85%] rounded-2xl p-3 sm:p-4 shadow-lg backdrop-blur-sm
          ${
            isUser
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ml-auto"
              : "bg-slate-800/80 border border-slate-700/50 text-slate-200"
          }
        `}
      >
        <div className="space-y-2">{renderFormattedContent(content)}</div>

        {/* 顯示工具調用信息（調試用，可選） */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-600/30">
            <div className="text-xs text-slate-400">
              使用了工具:{" "}
              {message.toolInvocations.map((inv) => inv.toolName).join(", ")}
            </div>
          </div>
        )}

        <div className="text-xs text-slate-400 mt-2 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString("zh-TW", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
