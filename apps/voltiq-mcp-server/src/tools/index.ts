import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Collection } from "mongodb";
import { registerYearlyUsageSummaryTool } from "./yearlyPowerUsageTool.js";
import { registerDailyUsageByMonthTool } from "./monthlyPowerUsageTool.js";
import { registerDailyPowerUsageTool } from "./dailyPowerUsageTool.js";
import { registerHighUsageTool } from "./overUsageTool.js";
import { registerComparePowerUsageTool } from "./comparePowerTool.js";

export function registerAllTools(server: McpServer, collection: Collection) {
  registerYearlyUsageSummaryTool(server, collection);
  registerDailyUsageByMonthTool(server, collection);
  registerDailyPowerUsageTool(server, collection);
  registerHighUsageTool(server, collection);
  registerComparePowerUsageTool(server, collection);
}
