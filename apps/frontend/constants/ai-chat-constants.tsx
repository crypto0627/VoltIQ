import type React from "react";
import { BarChart3, LineChart, Calendar, AlertTriangle } from "lucide-react";
import type { Chat, SuggestedQuestion } from "@/types/ui/ai-chat-type";

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    title: "This Month's Electricity Usage",
    question: "Show me this month's electricity usage data",
    icon: <BarChart3 className="h-4 w-4 text-white" />,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Annual Electricity Usage",
    question: "Show me the electricity usage trend over the past year",
    icon: <LineChart className="h-4 w-4 text-white" />,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Morning Peak Usage",
    question: "Show me the electricity usage from 08:00 to 12:00 in 01/01 (timeLabel 00:15/per label)",
    icon: <Calendar className="h-4 w-4 text-white" />,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Excess Contract Usage",
    question:
      "Show me the electricity usage exceeding the 2000kW contract capacity in October",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
    gradient: "from-amber-500 to-orange-500",
  },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    title: "New Chat",
    messages: [
      {
        id: "1",
        content:
          "Hello! I'm your AI assistant. I can help you generate charts and text analysis. How can I assist you today?",
        role: "assistant",
        timestamp: new Date().toISOString(),
      },
    ],
    lastUpdated: new Date(),
  },
];

export const INITIAL_ASSISTANT_MESSAGE = {
  id: Date.now().toString(), // This will be updated in the hook for uniqueness
  content: "Hello! I'm Fortune-ess AI Jake. What can I do for you?",
  role: "assistant" as const,
  timestamp: new Date(),
};
