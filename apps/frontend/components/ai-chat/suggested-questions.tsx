import type React from "react";
import { Button } from "@/components/ui/button";
import { SUGGESTED_QUESTIONS } from "@/constants/ai-chat-constants";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export function SuggestedQuestions({
  onQuestionClick,
}: SuggestedQuestionsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-slate-300 text-sm font-medium mb-4 text-center">
        Or try asking about:
      </h3>
      <div className="flex flex-wrap gap-3">
        {SUGGESTED_QUESTIONS.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onQuestionClick(item.question)}
            className="w-[calc(50%-6px)] h-[120px] p-4 text-left border-slate-600/50 hover:border-emerald-500/50 bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 group"
          >
            <div className="flex flex-col h-full w-full">
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r ${item.gradient} group-hover:scale-110 transition-transform duration-200`}
              >
                {item.icon}
              </div>
              <div className="flex-1 mt-3 w-full">
                <div className="font-medium text-slate-200 group-hover:text-emerald-300 transition-colors duration-200 w-full text-left">
                  {item.title}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2 w-full text-left">
                  {item.question}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
