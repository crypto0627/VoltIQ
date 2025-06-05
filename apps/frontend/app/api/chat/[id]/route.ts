// app/api/chat/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const chatId = context.params.id;

  try {
    // 先刪除所有相關訊息
    await prisma.message.deleteMany({
      where: { chatId },
    });

    // 再刪除 chat
    await prisma.chat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({
      message: "Chat and messages deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat." },
      { status: 500 },
    );
  }
}
