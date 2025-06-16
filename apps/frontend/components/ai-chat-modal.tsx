"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatHeader } from "@/components/ai-chat/chat-header";
import { ChatMessage } from "@/components/ai-chat/chat-message";
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar";
import { SUGGESTED_QUESTIONS } from "@/constants/ai-chat-constants";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/useUserStore";
import type { AiChatModalProps, Chat, Message } from "@/types/ui/ai-chat-type";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { Mic, Send } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export function AiChatModal({ open, onOpenChange }: AiChatModalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const {
    user,
    isLoading: isUserLoading,
    error: userError,
    fetchUser,
  } = useUserStore();
  const [isChatActionLoading, setIsChatActionLoading] = useState(false);

  const [isRecording, setIsRecording] = useState<Boolean>(false);

  const currentChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId),
    [chats, activeChatId],
  );

  // Use useChat hook for the active conversation
  const {
    messages,
    input,
    handleInputChange,
    isLoading: isAiChatLoading,
    append,
    setInput,
    setMessages,
  } = useChat({
    api: `/api/chat/${activeChatId}/message`,
    initialMessages: currentChat?.messages || [],
    id: activeChatId,
    // 添加工具調用處理
    onToolCall: async ({ toolCall }) => {
      console.log("Tool call received:", toolCall);
      // 工具調用會自動處理，不需要手動干預
    },
    onResponse: (response) => {
      console.log("Response received:", response);
    },
    onError: (error) => {
      console.error("AI Chat Error:", error);
      setIsChatActionLoading(false);
    },
    onFinish: (message, { usage, finishReason }) => {
      console.log("Message finished:", message);
      console.log("Tool invocations:", message.toolInvocations);

      // 將 useChat 的消息轉換為本地 Message 格式
      const updatedMessages: ExtendedMessage[] = messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant" | "system" | "data",
        timestamp: new Date().toISOString(),
        toolInvocations: msg.toolInvocations || undefined,
      }));

      // 添加剛完成的消息
      updatedMessages.push({
        id: message.id,
        content: message.content,
        role: message.role as "user" | "assistant" | "system" | "data",
        timestamp: new Date().toISOString(),
        toolInvocations: message.toolInvocations || undefined,
      });

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: updatedMessages as Message[],
                lastUpdated: new Date(),
              }
            : chat,
        ),
      );
      setIsChatActionLoading(false);
    },
  });

  // 將 useChat 的消息轉換為擴展的消息格式
  const extendedMessages: ExtendedMessage[] = useMemo(() => {
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as "user" | "assistant" | "system" | "data",
      timestamp: new Date().toISOString(),
      toolInvocations: msg.toolInvocations || undefined,
    }));
  }, [messages]);

  const handleReloadMessage = useCallback(async (content: string) => {
    if (!currentChat) return;

    setIsChatActionLoading(true);

    // Remove the last user message from the current chat's messages
    const updatedMessages = currentChat.messages.filter((msg) => msg.content !== content || msg.role !== "user");

    // Update the local chat state
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: updatedMessages as Message[] }
          : chat,
      ),
    );

    // Update the useChat hook's messages state
    setMessages(updatedMessages);

    // Re-send the message
    await append({ role: "user", content: content });

    setIsChatActionLoading(false);
  }, [currentChat, activeChatId, setChats, setMessages, append]);

  // Derived state to control visibility of suggested questions
  const showSuggestedQuestions =
    currentChat &&
    extendedMessages.length === 1 &&
    extendedMessages[0].role === "assistant";

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Create a new chat when the modal opens if no chats exist
  useEffect(() => {
    if (open && user && !isUserLoading && !activeChatId && chats.length === 0) {
      createNewChat();
    }
  }, [open, user, isUserLoading, activeChatId, chats.length]);

  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        const response = await fetch(`/api/chat/${chatId}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to delete chat");
        }

        setChats((prev) => {
          const remainingChats = prev.filter((chat) => chat.id !== chatId);
          if (remainingChats.length === 0) {
            return [];
          }
          if (activeChatId === chatId) {
            setActiveChatId(remainingChats[0]?.id || "");
          }
          return remainingChats;
        });
      } catch (error) {
        console.error("Failed to delete chat:", error);
      }
    },
    [activeChatId],
  );

  const deleteAllChats = useCallback(async () => {
    try {
      await Promise.all(chats.map((chat) => deleteChat(chat.id)));
    } catch (error) {
      console.error("Failed to delete all chats:", error);
    }
  }, [chats, deleteChat]);

  const createNewChat = useCallback(async () => {
    if (!user) {
      console.error("User not loaded, cannot create chat.");
      return null;
    }

    setIsChatActionLoading(true);

    try {
      const userId = user.id;

      const chatResponse = await fetch("/api/chat/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!chatResponse.ok) {
        const chatErrorData = await chatResponse
          .json()
          .catch(() => ({ message: "Unknown chat creation error" }));
        console.error(
          "Failed to create new chat:",
          chatResponse.status,
          chatErrorData,
        );
        throw new Error(
          `Failed to create new chat: ${chatErrorData.message || chatResponse.statusText}`,
        );
      }

      const newChat = await chatResponse.json();

      setChats((prevChats) => [
        {
          id: newChat.id,
          title: newChat.title || "New Chat",
          messages: newChat.messages || [],
          lastUpdated: new Date(),
        },
        ...prevChats,
      ]);

      setActiveChatId(newChat.id);
      setIsChatActionLoading(false);

      return newChat;
    } catch (error) {
      console.error("Error during new chat creation:", error);
      setIsChatActionLoading(false);
      return null;
    }
  }, [user]);

  const handleRecord = () => {
    setIsRecording((prev) => !prev);
    handleInputChange({
      target: { value: isRecording ? "" : "Recording..." },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleKeyPressInternal = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const isFirstUserMessage =
      !currentChat ||
      (currentChat.messages?.length === 1 &&
        currentChat.messages[0].role === "assistant");
    const messageContent = input.trim();
    let chatIdToAppendTo = activeChatId;

    setIsChatActionLoading(true);

    if (!currentChat) {
      const newChat = await createNewChat();
      if (!newChat) {
        setIsChatActionLoading(false);
        return;
      }
      chatIdToAppendTo = newChat.id;
    }

    await append({ role: "user", content: messageContent });
    setInput("");

    if (isFirstUserMessage) {
      const newTitle = messageContent.substring(0, 50) || "New Chat";
      try {
        const updateResponse = await fetch(
          `/api/chat/${chatIdToAppendTo}/update`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
          },
        );

        if (!updateResponse.ok) {
          console.error(
            "Failed to update new chat title:",
            updateResponse.status,
          );
        } else {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === chatIdToAppendTo
                ? { ...chat, title: newTitle, lastUpdated: new Date() }
                : chat,
            ),
          );
        }
      } catch (error) {
        console.error("Error updating new chat title:", error);
      }
    }
  };

  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [activeChatId, chats.length]);

  const handleSuggestedQuestion = async (question: string) => {
    if (!question.trim()) return;

    const isFirstUserMessage =
      !currentChat ||
      (currentChat.messages?.length === 1 &&
        currentChat.messages[0].role === "assistant");
    let chatIdToAppendTo = activeChatId;

    setIsChatActionLoading(true);

    if (!currentChat) {
      const newChat = await createNewChat();
      if (!newChat) {
        setIsChatActionLoading(false);
        return;
      }
      chatIdToAppendTo = newChat.id;
    }

    await append({ role: "user", content: question });

    if (isFirstUserMessage) {
      const newTitle = question.substring(0, 50) || "New Chat";
      try {
        const updateResponse = await fetch(
          `/api/chat/${chatIdToAppendTo}/update`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
          },
        );

        if (!updateResponse.ok) {
          console.error(
            "Failed to update new chat title:",
            updateResponse.status,
          );
        } else {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === chatIdToAppendTo
                ? { ...chat, title: newTitle, lastUpdated: new Date() }
                : chat,
            ),
          );
        }
      } catch (error) {
        console.error("Error updating new chat title:", error);
      }
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[90vh] max-w-full md:max-w-7xl p-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl"
        aria-describedby={undefined}
      >
        <div className="flex h-full w-full">
          {/* Sidebar - Mobile & Desktop */}
          <div
            className={`
              fixed inset-0 z-40 transition-transform duration-300
              bg-slate-900/90 md:static md:inset-auto md:z-auto md:translate-x-0
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              w-[85vw] sm:w-64 md:w-72 h-full
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

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full w-full md:w-auto">
            <ChatHeader
              isSidebarOpen={
                sidebarOpen &&
                (typeof window === "undefined" || window.innerWidth >= 768)
              }
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            />

            <div className="flex flex-col flex-1 p-2 sm:p-4 md:p-6 pt-0 min-h-0">
              {currentChat ? (
                <div className="flex-1 pr-2 sm:pr-4 mt-4 sm:mt-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
                  <div className="space-y-4">
                    {extendedMessages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        onReload={handleReloadMessage}
                      />
                    ))}

                    {(isUserLoading ||
                      isChatActionLoading ||
                      isAiChatLoading) && (
                      <div className="flex gap-2 sm:gap-3 justify-start">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                          <AvatarFallback>
                            <Image
                              src="/ai-button.jpg"
                              alt="AI Icon"
                              fill
                              className="text-white object-contain rounded-full border-4 border-blue-500/40"
                            />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm sm:text-base">
                  Select a chat or start a new one.
                </div>
              )}

              {showSuggestedQuestions && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-slate-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4 text-center">
                    Or try asking about:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {SUGGESTED_QUESTIONS.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleSuggestedQuestion(item.question)}
                        className="h-[100px] sm:h-[120px] p-3 sm:p-4 text-left border-slate-600/50 hover:border-emerald-500/50 bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 group"
                      >
                        <div className="flex flex-col h-full w-full">
                          <div
                            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gradient-to-r ${item.gradient} group-hover:scale-110 transition-transform duration-200`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1 mt-2 sm:mt-3 w-full">
                            <div className="font-medium text-sm sm:text-base text-slate-200 group-hover:text-emerald-300 transition-colors duration-200 w-full text-left">
                              {item.title}
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-400 mt-1 line-clamp-2 w-full text-left">
                              {item.question}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                <div className="relative flex-1">
                  <Input
                    value={isRecording ? "Recording..." : input}
                    onChange={(e) => !isRecording && handleInputChange(e)}
                    onKeyPress={handleKeyPressInternal}
                    placeholder={
                      isRecording
                        ? "Recording in progress..."
                        : "Give Jake a task to work on..."
                    }
                    disabled={Boolean(
                      isUserLoading ||
                        isChatActionLoading ||
                        isRecording ||
                        isAiChatLoading,
                    )}
                    className="pr-10 flex-1 bg-slate-800/50 border-slate-600/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-400 rounded-xl text-sm sm:text-base"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant={isRecording ? "default" : "outline"}
                    className={`absolute inset-y-0 right-0 h-full w-8 sm:w-10 ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "text-slate-400 hover:text-black/50"
                    }`}
                    onClick={handleRecord}
                  >
                    <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={Boolean(
                    isUserLoading ||
                      isChatActionLoading ||
                      !input.trim() ||
                      isRecording ||
                      isAiChatLoading,
                  )}
                  size="icon"
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white transition-all duration-300"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
