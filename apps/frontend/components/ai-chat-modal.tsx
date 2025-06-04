"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { AiChatModalProps } from "@/types/ui/ai-chat-type"
import { useChatLogic } from "@/hooks/use-chat"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"
import { ChatHeader } from "@/components/ai-chat/chat-header"
import { MessageList } from "@/components/ai-chat/message-list"
import { SuggestedQuestions } from "@/components/ai-chat/suggested-questions"
import { ChatInput } from "@/components/ai-chat/chat-input"

export function AiChatModal({ open, onOpenChange }: AiChatModalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined"
      ? window.innerWidth >= 768
      : true
  )
  const [input, setInput] = useState("")
  const {
    chats,
    activeChatId,
    setActiveChatId,
    currentChat,
    isNewChat,
    isLoading,
    createNewChat,
    deleteChat,
    deleteAllChats,
    sendMessage,
  } = useChatLogic()

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (currentChat) {
      console.log("currentChat", currentChat)
      await sendMessage(input, currentChat.id);
    } else {
      const newChat = await createNewChat();
      if (newChat) {
        setActiveChatId(newChat.id);
        await sendMessage(input, newChat.id);
      }
    }
    setInput("");
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (currentChat) {
      await sendMessage(question, currentChat.id);
    } else {
      const newChat = await createNewChat();
      if (newChat) {
        setActiveChatId(newChat.id);
        await sendMessage(question, newChat.id);
      }
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-w-full md:max-w-7xl p-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl">
        <div className="flex h-full w-full">
          <div
            className={`
              fixed inset-0 z-40 transition-transform duration-300
              bg-slate-900/90 md:static md:inset-auto md:z-auto md:translate-x-0
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              w-64 md:w-72 h-full
              md:flex
            `}
            style={{
              display: sidebarOpen ? "block" : "none",
            }}
          >
            <ChatSidebar
              isOpen={sidebarOpen}
              chats={chats}
              activeChatId={activeChatId}
              onSetActiveChat={setActiveChatId}
              onCreateNewChat={async () => {
                const newChat = await createNewChat();
                if (newChat) setActiveChatId(newChat.id);
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              onDeleteChat={handleDeleteChat}
              onDeleteAllChats={deleteAllChats}
            />
          </div>

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
          )}

          <div className="flex-1 flex flex-col h-full w-full md:w-auto">
            <ChatHeader
              isSidebarOpen={sidebarOpen && (typeof window === "undefined" || window.innerWidth >= 768)}
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            />

            <div className="flex flex-col flex-1 p-2 sm:p-4 md:p-6 pt-0 min-h-0">
              {currentChat ? (
                <MessageList messages={currentChat.messages} isLoading={isLoading} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                  Select a chat or start a new one.
                </div>
              )}

              {currentChat && isNewChat && (
                <SuggestedQuestions onQuestionClick={handleSuggestedQuestion} />
              )}

              <ChatInput
                input={input}
                onInputChange={setInput}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}