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
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: content
        }
      ]
    });

    // 儲存 assistant 訊息
    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        role: Role.assistant,
        content: response.content[0].text,
      },
    })

    return NextResponse.json([userMessage, assistantMessage])
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }
}
