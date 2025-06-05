import type React from "react";
import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Chat } from "@/types/ui/ai-chat-type";
import { ChatListItem } from "./chat-listItem";

interface ChatSidebarProps {
  isOpen: boolean;
  chats: Chat[];
  activeChatId: string | null;
  onSetActiveChat: (id: string) => void;
  onCreateNewChat: () => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  onDeleteAllChats: () => void;
}

export function ChatSidebar({
  isOpen,
  chats,
  activeChatId,
  onSetActiveChat,
  onCreateNewChat,
  onDeleteChat,
  onDeleteAllChats,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filteredChats = chats
    .filter((chat) =>
      chat.title
        ? chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        : false,
    )
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()); // Sort by most recently updated

  if (!isOpen) {
    return (
      <div className="h-full bg-gradient-to-b from-slate-900/90 to-slate-800/90 border-r border-slate-700/50 transition-all duration-300 w-0 backdrop-blur-sm"></div>
    );
  }

  return (
    <>
      <div className="h-full w-72 bg-gradient-to-b from-slate-900/90 to-slate-800/90 border-r border-slate-700/50 transition-all duration-300 flex flex-col backdrop-blur-sm">
        <div className="p-4 border-b border-slate-700/50">
          <Button
            onClick={onCreateNewChat}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>

        <div className="p-4 border-b border-slate-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search chats..."
              className="pl-10 bg-slate-800/50 border-slate-600/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onSelect={() => onSetActiveChat(chat.id)}
                onDelete={(e) => onDeleteChat(chat.id, e)}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-700/50">
          <Button
            variant="ghost"
            onClick={() => setShowConfirmModal(true)}
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete All Chats
          </Button>
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400 text-center">
            Powered by{" "}
            <span className="text-emerald-400 font-medium">JakeKuo</span>
          </p>
        </div>
      </div>
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all your chats? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDeleteAllChats();
                setShowConfirmModal(false);
              }}
            >
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
