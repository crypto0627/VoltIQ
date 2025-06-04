import type React from "react"
import { User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Message } from "@/types/ui/ai-chat-type"
import Image from "next/image"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {

  const isUser = message.role === "user"
  let timeString = ""
  if (message.timestamp) {
    try {
      timeString = new Date(message.timestamp).toLocaleTimeString()
    } catch {}
  }

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
          <AvatarFallback>
            <Image src="/ai-button.jpg" alt="AI Icon" fill className="text-white object-contain rounded-full border-4 border-blue-500/40" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
          isUser
            ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white"
            : "bg-slate-800/80 text-slate-200 border border-slate-700/50 backdrop-blur-sm"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content.split('\n').map((line, index) => {
            if (line.startsWith('每月用電量：')) {
              return <p key={index} className="font-medium">{line}</p>;
            } else if (line.match(/^\d{1,2}月:/)) {
              return <p key={index} className="ml-4">• {line}</p>;
            } else if (line.startsWith('全年總用電量：')) {
              return <p key={index} className="font-semibold mt-2">{line}</p>;
            }
            return <p key={index}>{line}</p>;
          })}
        </div>
        <p className="text-xs opacity-70 mt-2">{timeString}</p>
      </div>

      {isUser && (
        <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
          <AvatarFallback>
            <User className="h-5 w-5 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}