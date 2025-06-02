// app/api/chat/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const chatId = context.params.id

  try {
    await prisma.chat.delete({
      where: { id: chatId },
    })

    return NextResponse.json({ message: "Chat deleted successfully" })
  } catch (error) {
    console.error("Error deleting chat:", error)
    return NextResponse.json({ error: "Failed to delete chat." }, { status: 500 })
  }
}
