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
    if (!content.trim() || !targetChatId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === targetChatId) {
          const isFirstUserMessage = chat.messages.length === 1 && chat.messages[0].role === "assistant"
          const newTitle = isFirstUserMessage
            ? content.length > 20
              ? content.substring(0, 20) + "..."
              : content
            : chat.title

          return {
            ...chat,
            messages: [...chat.messages, userMessage],
            title: newTitle,
            lastUpdated: new Date(),
          }
        }
        return chat
      }),
    )

    setIsLoading(true)

    try {
      // Simulate API call and SSE response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `This is a demo response to: "${content}"`,
          role: "assistant",
          timestamp: new Date(),
        }

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === targetChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, aiMessage],
                  lastUpdated: new Date(),
                }
              : chat,
          ),
        )
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to send message:", error)
      setIsLoading(false)
    }
  }, [activeChatId])

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