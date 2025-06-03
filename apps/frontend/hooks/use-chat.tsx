import { useState, useEffect, useCallback } from "react"
import type { Chat, Message } from "@/types/ui/ai-chat-type"
import { MOCK_CHATS } from "@/constants/ai-chat-constants"
import useUserStore from "@/stores/useUserStore"

export function useChatLogic(initialChats: Chat[] = MOCK_CHATS) {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [activeChatId, setActiveChatId] = useState<string>(initialChats[0]?.id || "")
  const { user, isLoading: isUserLoading, error: userError, fetchUser } = useUserStore();
  const [isChatActionLoading, setIsChatActionLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
    if (chats.length === 0) {
      createNewChat();
    } else if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId, createNewChat]);

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

    const targetChatId = chatIdToUpdate || activeChatId
    if (!content.trim()) return
  
    let isNewChat = false
    const targetChat = chats.find((chat) => chat.id === targetChatId)
  
    if (!targetChat && !isNewChat) {
      console.error("sendMessage called with invalid targetChatId and not a new chat scenario.");
      setIsChatActionLoading(false);
      return;
    }
  
    if (targetChat?.messages?.length === 1 && targetChat?.messages[0].role === "assistant") {
      isNewChat = true
    }
  
    setIsChatActionLoading(true)
  
    try {
      let newChatId = targetChatId
  
      if (isNewChat) {
        const res = await fetch("/api/chat/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        })
  
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
          console.error("Failed to create new chat:", res.status, errorData);
          setIsChatActionLoading(false);
          return;
        }
  
        const chatFromServer = await res.json()
        newChatId = chatFromServer.id
  
        setChats((prev) => [
          {
            id: chatFromServer.id,
            title: chatFromServer.title,
            messages: chatFromServer.messages || [],
            lastUpdated: new Date(chatFromServer.updatedAt),
          },
          ...prev.filter((c) => c.id !== targetChatId),
        ])
        setActiveChatId(chatFromServer.id)
      }
  
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date().toISOString(),
      }
  
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === newChatId
            ? {
                ...chat,
                messages: chat.messages ? [...chat.messages, userMessage] : [userMessage],
                title:
                  isNewChat
                    ? content.slice(0, 20) + (content.length > 20 ? "..." : "")
                    : chat.title,
                lastUpdated: new Date(),
              }
            : chat,
        ),
      )
  
      if (isNewChat) {
        const firstMessageTitle = content.slice(0, 20) + (content.length > 20 ? "..." : "");
        await fetch(`/api/chat/${newChatId}/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: firstMessageTitle }),
        });
      }
  
      const response = await fetch(`/api/chat/${newChatId}/message`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to send message: ${errorData.message || response.statusText}`);
      }

      const [userMessageFromServer, assistantMessage] = await response.json()

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === newChatId
            ? {
                ...chat,
                messages: chat.messages 
                  ? [...chat.messages.filter(m => m.id !== userMessage.id), userMessageFromServer, assistantMessage]
                  : [userMessageFromServer, assistantMessage],
                lastUpdated: new Date(),
              }
            : chat,
        ),
      )
      setIsChatActionLoading(false)
    } catch (error) {
      console.error("Failed to send message:", error)
      setIsChatActionLoading(false)
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