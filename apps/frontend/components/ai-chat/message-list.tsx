import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Message } from "@/types/ui/ai-chat-type"
import { ChatMessage } from "./chat-message"
import Image from "next/image"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 pr-4 mt-6 overflow-y-auto max-h-[70vh]">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
              <AvatarFallback>
                <Image
                  src="/ai-button.jpg"
                  alt="AI Icon"
                  fill
                  className="text-white object-contain rounded-full border-4 border-blue-500/40"
                />
              </AvatarFallback>
            </Avatar>
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}