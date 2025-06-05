"use client";
/// <reference lib="dom" />
/// <reference lib="webworker" />
import type React from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export function ChatInput({
  input,
  onInputChange,
  onSendMessage,
  isLoading,
  onKeyPress,
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState<Boolean>(false);

  const handleKeyPressInternal = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  const handleRecord = () => {
    setIsRecording((prev) => !prev);
    onInputChange(isRecording ? "" : "Recording...");
  };

  return (
    <div className="flex gap-3 mt-4">
      <div className="relative flex-1">
        <Input
          value={isRecording ? "Recording..." : input}
          onChange={(e) => !isRecording && onInputChange(e.target.value)}
          onKeyPress={handleKeyPressInternal}
          placeholder={
            isRecording
              ? "Recording in progress..."
              : "Give Jake a task to work on..."
          }
          disabled={Boolean(isLoading || isRecording)}
          className="pr-10 flex-1 bg-slate-800/50 border-slate-600/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-400 rounded-xl"
        />
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "default" : "outline"}
          className={`absolute inset-y-0 right-0 h-full w-10 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "text-slate-400 hover:text-black/50"
          }`}
          onClick={handleRecord}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
      <Button
        onClick={onSendMessage}
        disabled={Boolean(isLoading || !input.trim() || isRecording)}
        size="icon"
        className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/25 rounded-xl"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
