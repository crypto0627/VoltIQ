import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getChromaClient } from "@/lib/chromadb";

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const mongoCollection = db.collection("electricity_usage");

    const dataToVectorize = await mongoCollection.find({}).toArray();

    if (dataToVectorize.length === 0) {
      return NextResponse.json(
        { message: "No data found in MongoDB collection." },
        { status: 200 },
      );
    }

    const chromaClient = await getChromaClient();

    const chromaCollectionName = "electricity_usage";
    const chromaCollection = await chromaClient.getOrCreateCollection({
      name: chromaCollectionName,
    });

    // Prepare data for ChromaDB
    const ids = dataToVectorize.map((doc) => doc._id.toString()); // Use MongoDB _id as Chroma ID
    const documents = dataToVectorize.map((doc) => JSON.stringify(doc)); // Store the whole document as text
    // You might want to select specific fields for vectorization instead of the whole document.
    // For example, documents = dataToVectorize.map(doc => doc.textField);

    // Add data to ChromaDB. The embedding function defined in getOrCreateCollection will be used.
    await chromaCollection.add({
      ids: ids,
      documents: documents,
      // Optionally, you can add metadata to filter results later
      // metadatas: dataToVectorize.map(doc => ({ source: 'mongodb' }))
    });

    return NextResponse.json(
      { message: "Data successfully vectorized and stored in ChromaDB." },
      { status: 200 },
    );
  } catch (error: any) {
    // Explicitly type error
    console.error("Error inserting vector data:", error);
    return NextResponse.json(
      { message: "Error processing data.", error: error.message },
      { status: 500 },
    );
  } finally {
    // Connection utilities manage closing, no need to close here manually
    // if (mongoClient) {
    //   await mongoClient.close();
    // }
    // ChromaClient might not have a close method depending on the setup, adjust if necessary
  }
}
