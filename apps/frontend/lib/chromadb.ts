import { ChromaClient } from "chromadb";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

let chromaClient: ChromaClient | null = null;

export async function getChromaClient(): Promise<ChromaClient> {
  if (chromaClient) {
    return chromaClient;
  }

  try {
    chromaClient = new ChromaClient({ path: CHROMA_URL });
    await chromaClient.heartbeat();
    console.log("Connected to ChromaDB");
    return chromaClient;
  } catch (error) {
    console.error("Error connecting to ChromaDB:", error);
    throw new Error("Failed to connect to ChromaDB");
  }
}
