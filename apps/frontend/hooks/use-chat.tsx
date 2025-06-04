import { useState, useEffect, useCallback } from "react"
import type { Chat, Message } from "@/types/ui/ai-chat-type"
import useUserStore from "@/stores/useUserStore"
import { useChat } from "@ai-sdk/react";

export function useChatLogic() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string>("")
  const { user, isLoading: isUserLoading, error: userError, fetchUser } = useUserStore();
  const [isChatActionLoading, setIsChatActionLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // On mount, if no chats, create a new chat from API
  useEffect(() => {
    const initChat = async () => {
      if (!user) return;
      if (chats.length === 0) {
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
            const chatErrorData = await chatResponse.json().catch(() => ({ message: 'Unknown chat creation error' }));
            console.error("Failed to create new chat:", chatResponse.status, chatErrorData);
            throw new Error(`Failed to create new chat: ${chatErrorData.message || chatResponse.statusText}`);
          }
          const newChat = await chatResponse.json();
          setChats([{
            id: newChat.id,
            title: newChat.title,
            messages: newChat.messages || [],
            lastUpdated: new Date(newChat.updatedAt),
          }]);
          setActiveChatId(newChat.id);
        } catch (error) {
          console.error("Error during initial chat creation:", error);
        } finally {
          setIsChatActionLoading(false);
        }
      }
    };
    initChat();
  }, [user]); // only run on user change/mount

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
        const chatErrorData = await chatResponse.json().catch(() => ({ message: 'Unknown chat creation error' }));
        console.error("Failed to create new chat:", chatResponse.status, chatErrorData);
        throw new Error(`Failed to create new chat: ${chatErrorData.message || chatResponse.statusText}`);
      }

      const newChat = await chatResponse.json();

      setChats((prev) => [{
        id: newChat.id,
        title: newChat.title,
        messages: newChat.messages || [],
        lastUpdated: new Date(newChat.updatedAt),
      }, ...prev]);

      setActiveChatId(newChat.id);
      setIsChatActionLoading(false);
      return newChat;

    } catch (error) {
      console.error("Error during createNewChat process:", error);
      setIsChatActionLoading(false);
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (chats.length === 0 && user) {
      // Already handled by the above effect
      // createNewChat();
    } else if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId, user]);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      setChats((prev) => {
        const remainingChats = prev.filter((chat) => chat.id !== chatId)
        if (remainingChats.length === 0) {
          return []
        }
        if (activeChatId === chatId) {
          setActiveChatId(remainingChats[0]?.id || "")
        }
        return remainingChats
      })
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }, [activeChatId])

  const deleteAllChats = useCallback(async () => {
    try {
      await Promise.all(chats.map(chat => deleteChat(chat.id)));
    } catch (error) {
      console.error("Failed to delete all chats:", error)
    }
  }, [chats, deleteChat])

  const sendMessage = useCallback(async (content: string, chatIdToUpdate?: string) => {
    if (!user) {
      console.error("User not loaded, cannot send message.");
      return;
    }
  
    const targetChatId = chatIdToUpdate || activeChatId;
    if (!content.trim()) return;
  
    const targetChat = chats.find((chat) => chat.id === targetChatId);
    if (!targetChat) {
      console.error("sendMessage called with invalid targetChatId.");
      setIsChatActionLoading(false);
      return;
    }
  
    setIsChatActionLoading(true);
  
    try {
      // Optimistic UI - 加入用戶訊息
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date().toISOString(),
      };
  
      setChats(prev => prev.map(chat => chat.id === targetChatId ? {
        ...chat,
        messages: [...(chat.messages ?? []), userMessage],
        lastUpdated: new Date(),
      } : chat));
  
      // 發送訊息並接收 stream
      const response = await fetch(`/api/chat/${targetChatId}/message`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to send message: ${errorData.message || response.statusText}`);
      }
  
      // 讀取 ReadableStream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream reader");
  
      let assistantMessageContent = "";
      const decoder = new TextDecoder();
  
      // 新增一則 assistant 訊息（初始為空）
      const assistantMessageId = Date.now().toString() + "-assistant";
      setChats(prev => prev.map(chat => chat.id === targetChatId ? {
        ...chat,
        messages: [...(chat.messages ?? []), { id: assistantMessageId, content: "", role: "assistant", timestamp: new Date().toISOString() }],
      } : chat));
  
      // 持續讀取串流 chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunkText = decoder.decode(value, { stream: true });
        assistantMessageContent += chunkText;
  
        // 每讀取一次 chunk 就更新 assistant message
        setChats(prev => prev.map(chat => {
          if (chat.id === targetChatId) {
            return {
              ...chat,
              messages: chat.messages?.map(msg => 
                msg.id === assistantMessageId ? { ...msg, content: assistantMessageContent } : msg
              ) ?? [],
            };
          }
          return chat;
        }));
      }
  
      setIsChatActionLoading(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsChatActionLoading(false);
    }
  }, [chats, activeChatId, user]);
  
  const currentChat = chats.find((chat) => chat.id === activeChatId)

  const isNewChat = currentChat
    ? currentChat.messages?.length === 1 && currentChat.messages[0].role === "assistant"
    : false

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user && !isUserLoading) {
         console.warn("Attempted to load chat history before user was loaded.");
         return;
      }
      try {
        const chat = chats.find((c) => c.id === activeChatId)
        if (!chat && chats.length > 0) {
          setActiveChatId(chats[0].id)
        } else if (!chat && chats.length === 0) {
        }
      } catch (error) {
        console.error("Failed to load chat history:", error)
      }
    }

    if (activeChatId && user) {
      loadChatHistory()
    } else if (!activeChatId && chats.length > 0 && user) {
       setActiveChatId(chats[0].id);
    }

  }, [activeChatId, chats, createNewChat, user, isUserLoading])

  const isLoading = isUserLoading || isChatActionLoading;

  return {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    currentChat,
    isNewChat,
    isLoading,
    createNewChat,
    deleteChat,
    deleteAllChats,
    sendMessage,
    user,
    userError,
    isUserLoading
  }
}