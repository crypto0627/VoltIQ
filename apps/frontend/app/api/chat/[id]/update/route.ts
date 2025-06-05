import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const chatId = context.params.id;
  try {
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { title },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error updating chat title:", error);
    return NextResponse.json(
      { error: "Failed to update chat title." },
      { status: 500 },
    );
  }
}
