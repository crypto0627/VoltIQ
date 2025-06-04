import type React from "react"
import { MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Chat } from "@/types/ui/ai-chat-type"
import { format } from "date-fns"

interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
}

export function ChatListItem({ chat, isActive, onSelect, onDelete }: ChatListItemProps) {
  // Truncate title if it's longer than 40 characters
  const displayTitle = chat.title && chat.title.length > 20
    ? `${chat.title.substring(0, 20)}...`
    : chat.title || 'New Chat'; // Fallback to 'New Chat' if title is null/undefined

  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all duration-300",
        isActive
          ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30"
          : "hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 border border-transparent hover:border-slate-600/50"
      )}
    >
      <div className="flex flex-col space-y-1 truncate">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm font-medium">{displayTitle}</span>
        </div>
        <span className="text-xs text-slate-400 pl-7">
          {format(chat.lastUpdated, "MMM d, h:mm a")}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        onClick={onDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}