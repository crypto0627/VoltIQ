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
import { MOCK_CHATS } from "@/constants/ai-chat-constants"

export function AiChatModal({ open, onOpenChange }: AiChatModalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
  } = useChatLogic(MOCK_CHATS)

  const handleSendMessage = () => {
    if (!input.trim()) return
    if (currentChat) { // Ensure currentChat is defined
      sendMessage(input, currentChat.id)
    } else if (chats.length > 0) { // Fallback if currentChat is somehow undefined but chats exist
      sendMessage(input, chats[0].id)
    } else {
        createNewChat().then(newChat => {
            if(newChat) {
                sendMessage(input, newChat.id);
            }
        })
    }
    setInput("")
  }

  const handleSuggestedQuestion = (question: string) => {
     if (currentChat) {
        sendMessage(question, currentChat.id)
    } else if (chats.length > 0) {
        sendMessage(question, chats[0].id);
    } else {
        createNewChat().then(newChat => {
            if (newChat) {
                sendMessage(question, newChat.id);
            }
        })
    }
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-w-7xl p-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl">
        <div className="flex h-full">
          <ChatSidebar
            isOpen={sidebarOpen}
            chats={chats}
            activeChatId={activeChatId}
            onSetActiveChat={setActiveChatId}
            onCreateNewChat={async () => {
                if (isNewChat && !input.trim()) {
                    console.log("Current chat is empty, cannot create a new one.");
                    return;
                }
                const newChat = await createNewChat();
                if (newChat) setActiveChatId(newChat.id);
            }}
            onDeleteChat={handleDeleteChat}
            onDeleteAllChats={deleteAllChats}
          />

          <div className="flex-1 flex flex-col h-full">
            <ChatHeader
              isSidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex flex-col flex-1 p-6 pt-0">
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