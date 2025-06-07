"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Clock, DollarSign, Activity, Bot } from "lucide-react";
import { AiChatModal } from "@/components/ai-chat-modal";
import Image from "next/image";
import ElectricityUsageChart from "@/components/dashboard/loading-usage";
import BatteryStatusChart from "@/components/dashboard/battery-status-chart";
import ChargeChart from "@/components/dashboard/charge-chart";

export default function DashboardPage() {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Left section */}
        <div className="xl:w-2/5 space-y-4">
          {/* Electricity Usage Overview Card */}
            <ElectricityUsageChart />
            <ChargeChart />
        </div>

        {/* Middle section */}
        <div className="xl:w-2/5 space-y-4">
          <BatteryStatusChart />
          <BatteryStatusChart />
        </div>

        {/* Right section - Stats Cards */}
        <div className="xl:w-1/5 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Usage</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350 kWh</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Off-Peak Usage</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,850 kWh</div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mid-Peak Usage</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,200 kWh</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Electricity Bill</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's electricity usage</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5000kWh</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full p-0 border-4 border-blue-500/40"
      >
        <div className="relative h-full w-full">
          <Image
            src="/ai-button.jpg"
            alt="AI Assistant"
            fill
            className="rounded-full object-cover"
          />
        </div>
      </Button>
      <AiChatModal open={aiChatOpen} onOpenChange={setAiChatOpen} />
    </div>
  );
}
