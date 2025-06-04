import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Collection } from "mongodb";
import { registerYearlyUsageSummaryTool } from "./yearlyPowerUsageTool.js";
import { registerMonthlyUsageSummaryTool } from "./monthlyPowerUsageTool.js";
import { registerDailyPowerUsageTool } from "./dailyPowerUsageTool.js";
import { registerHighUsageTool } from "./overUsageTool.js";

export function registerAllTools(server: McpServer, collection: Collection) {
    registerYearlyUsageSummaryTool(server, collection)
    registerMonthlyUsageSummaryTool(server, collection)
    registerDailyPowerUsageTool(server, collection);
    registerHighUsageTool(server, collection);
} 