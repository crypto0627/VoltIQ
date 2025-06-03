import { NextResponse } from 'next/server';
import { getChromaClient } from '@/lib/chromadb';

export async function GET() {
  try {
    const chromaClient = await getChromaClient();
    const collection = await chromaClient.getOrCreateCollection({
      name: "electricity_usage",
    });

    const data = await collection.get();

    if (data.ids.length === 0) {
      return NextResponse.json({ message: "No data found in ChromaDB collection." }, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching data from ChromaDB:', error);
    return NextResponse.json({ message: "Error fetching data from ChromaDB.", error: error.message }, { status: 500 });
  }
}
