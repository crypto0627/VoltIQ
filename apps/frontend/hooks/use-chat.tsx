import { useState, useEffect, useCallback } from "react"
import type { Chat, Message } from "@/types/ui/ai-chat-type"
import { MOCK_CHATS, INITIAL_ASSISTANT_MESSAGE } from "@/constants/ai-chat-constants"

export function useChatLogic(initialChats: Chat[] = MOCK_CHATS) {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [activeChatId, setActiveChatId] = useState<string>(initialChats[0]?.id || "")
  const [isLoading, setIsLoading] = useState(false)

  const createNewChat = useCallback(async () => {
    try {
      const newChatId = Date.now().toString()
      const newChat: Chat = {
        id: newChatId,
        title: "New Chat",
        messages: [
          {
            ...INITIAL_ASSISTANT_MESSAGE,
            id: Date.now().toString() + "_msg", // ensure unique message id
            timestamp: new Date(),
          },
        ],
        lastUpdated: new Date(),
      }
      setChats((prev) => [newChat, ...prev])
      setActiveChatId(newChat.id)
      return newChat;
    } catch (error) {
      console.error("Failed to create new chat:", error)
      return null;
    }
  }, [])

  useEffect(() => {
    // Ensure there's always at least one chat, and an active chat is set.
    if (chats.length === 0) {
      createNewChat();
    } else if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId, createNewChat]);


  const deleteChat = useCallback(async (chatId: string) => {
    try {
      setChats((prev) => {
        const remainingChats = prev.filter((chat) => chat.id !== chatId)
        if (remainingChats.length === 0) {
          // createNewChat will be called by the useEffect if chats become empty
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
      setChats([])
      // createNewChat will be called by the useEffect
    } catch (error) {
      console.error("Failed to delete all chats:", error)
    }
  }, [])

  const sendMessage = useCallback(async (content: string, chatIdToUpdate?: string) => {
    const targetChatId = chatIdToUpdate || activeChatId
    if (!content.trim()) return
  
    let isNewChat = false
    const targetChat = chats.find((chat) => chat.id === targetChatId)
  
    if (!targetChat) return
  
    // 檢查是否是假 chat（僅含 welcome 訊息）
    if (targetChat.messages.length === 1 && targetChat.messages[0].role === "assistant") {
      isNewChat = true
    }
  
    setIsLoading(true)
  
    try {
      let newChatId = targetChatId
  
      // 如果是新 chat，先 call /api/chat/new
      if (isNewChat) {
        const res = await fetch("/api/chat/new", {
          method: "POST",
        })
  
        const chatFromServer = await res.json()
        newChatId = chatFromServer.id
  
        // 更新 frontend chats list
        setChats((prev) => [
          {
            id: chatFromServer.id,
            title: chatFromServer.title,
            messages: chatFromServer.messages,
            lastUpdated: new Date(chatFromServer.updatedAt),
          },
          ...prev.filter((c) => c.id !== targetChatId), // 移除 local 虛擬 chat
        ])
        setActiveChatId(chatFromServer.id)
      }
  
      // 建立 user 訊息
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date(),
      }
  
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === newChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                title:
                  chat.messages.length === 1 && chat.messages[0].role === "assistant"
                    ? content.slice(0, 20) + (content.length > 20 ? "..." : "")
                    : chat.title,
                lastUpdated: new Date(),
              }
            : chat,
        ),
      )
  
      // Call message API
      const response = await fetch(`/api/chat/${newChatId}/message`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const aiMessage = await response.json()

      // 更新 AI 回應
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === newChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
                lastUpdated: new Date(),
              }
            : chat,
        ),
      )
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to send message:", error)
      setIsLoading(false)
    }
  }, [chats, activeChatId])
  

  // Get current chat based on activeChatId
  const currentChat = chats.find((chat) => chat.id === activeChatId)

  // Check if current chat is new (only has welcome message)
  const isNewChat = currentChat
    ? currentChat.messages.length === 1 && currentChat.messages[0].role === "assistant"
    : false // If no currentChat, it's not a "new chat" in this context

  // Load chat history (simplified, as it's mostly for ensuring a chat exists)
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const chat = chats.find((c) => c.id === activeChatId)
        if (!chat && chats.length > 0) {
          // This case should be rare due to the other useEffect, but as a fallback
          setActiveChatId(chats[0].id)
        } else if (!chat && chats.length === 0) {
            // This will trigger the other useEffect to create a new chat
        }
      } catch (error) {
        console.error("Failed to load chat history:", error)
        // createNewChat(); // This might cause loops, handled by other effect
      }
    }

    if (activeChatId) {
      loadChatHistory()
    }
  }, [activeChatId, chats, createNewChat])

  return {
    chats,
    setChats, // Exposing for potential direct manipulation if ever needed, though usually not
    activeChatId,
    setActiveChatId,
    currentChat,
    isNewChat,
    isLoading,
    setIsLoading, // Exposing for fine-grained control if needed
    createNewChat,
    deleteChat,
    deleteAllChats,
    sendMessage,
  }
}