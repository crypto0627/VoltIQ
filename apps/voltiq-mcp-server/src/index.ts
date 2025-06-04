import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

// Create server instance
const server = new McpServer({
  name: "electricity-usage",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
  const transport = new StdioServerTransport();
  // Connect to MongoDB
  const { db } = await connectToDatabase();
  const mongoCollection = db.collection('electricity_usage');
  registerAllTools(server, mongoCollection);
  await server.connect(transport);
  console.error("Electricity Usage MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

async function connectToDatabase() {
    const uri = process.env.MONGODB_URI || "mongodb://mongo1:27017,mongo2:27018,mongo3:27019/?replicaSet=rs0"
  
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
  
    const client = new MongoClient(uri);
    await client.connect();
  
    const db = client.db(process.env.MONGODB_DB || "voltiq"); // 可改為 db("volt-iq") 指定 DB 名稱
    return { db, client };
  }
  