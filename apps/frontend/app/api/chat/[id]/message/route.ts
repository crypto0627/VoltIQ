// app/api/chat/[id]/message/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Role } from "@/lib/generated/prisma"
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const chatId = context.params.id

  try {
    const { content } = await req.json()
    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // 儲存 user 訊息
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        role: Role.user,
        content,
      },
    })

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024, // Adjust max_tokens as needed
      messages: [
        {
          role: "user", // Use the user's message content
          content: content
        }
      ]
    });

    // Process Anthropic response
    let assistantContent = '';
    if (response.content && response.content.length > 0) {
      // Check if the first content block is of type 'text'
      if (response.content[0].type === 'text') {
        assistantContent = response.content[0].text;
      } else {
        // Handle other content types if necessary (e.g., tool_use)
        // For now, we'll just log a warning or set a default message
        console.warn("Anthropic response contained non-text content:", response.content[0]);
        assistantContent = "Received a non-text response from the AI."; // Fallback message
      }
    } else {
       console.warn("Anthropic response content was empty or null:", response.content);
       assistantContent = "Received an empty response from the AI."; // Fallback message
    }


    // 儲存 assistant 訊息
    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        role: Role.assistant,
        content: assistantContent, // Use the extracted or fallback content
      },
    })

    // Return both messages, similar to the original logic in useChatLogic's sendMessage
    // The useChatLogic hook expects an array of messages here
    return NextResponse.json([userMessage, assistantMessage])

  } catch (error) {
    console.error("Error sending message:", error) // Detailed server-side log
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 }) // Generic error to client
  }
}
