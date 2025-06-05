// app/api/chat/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 刪除所有 chat 及其相關訊息
export async function POST(req: NextRequest) {
  try {
    // 先刪除所有訊息
    await prisma.message.deleteMany({});

    // 再刪除所有 chat
    await prisma.chat.deleteMany({});

    return NextResponse.json({
      message: "All chats and messages deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all chats and messages:", error);
    return NextResponse.json(
      { error: "Failed to delete all chats and messages." },
      { status: 500 },
    );
  }
}
