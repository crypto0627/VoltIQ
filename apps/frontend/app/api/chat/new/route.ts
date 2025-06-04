// app/api/chat/new/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = body.userId ?? null
    // Validate userId if provided
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      })
      
      if (!userExists) {
        return NextResponse.json({ error: "Invalid user ID provided." }, { status: 400 })
      }
    }

    const chat = await prisma.chat.create({
      data: {
        title: "New Chat",
        userId,
        messages: {
          create: [
            {
              role: "assistant",
              content: "Hello! I'm your AI assistant Jake. I can help you generate charts and text analysis. How can I assist you today?",
            },
          ],
        },
      },
      include: { messages: true },
    })

    return NextResponse.json(chat)
  } catch (error: any) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Failed to create chat." }, { status: 500 })
  }
}
