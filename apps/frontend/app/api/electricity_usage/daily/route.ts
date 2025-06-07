import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { date } = await request.json();
    const { db } = await connectToDatabase();
    const usageData = await db
      .collection("electricity_usage")
      .findOne({ date: date });

    if (!usageData) {
      return NextResponse.json(
        { error: "No data found for the specified date" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      date: date,
      usageData: usageData.usageData
    });

  } catch (error) {
    console.error("Error fetching daily electricity usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily electricity usage" },
      { status: 500 }
    );
  }
}
