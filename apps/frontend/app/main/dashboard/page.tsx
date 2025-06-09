"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Clock, DollarSign, Activity } from "lucide-react";
import { AiChatModal } from "@/components/ai-chat-modal";
import Image from "next/image";
import ElectricityUsageChart from "@/components/dashboard/loading-usage";
import BatteryStatusChart from "@/components/dashboard/battery-status-chart";
import ChargeChart from "@/components/dashboard/charge-chart";
import SystemStatus from "@/components/dashboard/system-status";
import { InfoCard } from "@/components/dashboard/info-card";
import { useElectricityStore } from "@/stores/electricityStore";
import { useUsageCalculations } from "@/hooks/use-usage-calculations";
import { InfoCardList } from "@/components/dashboard/info-card-list";

export default function DashboardPage() {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const { startSimulation, stopSimulation } = useElectricityStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const usage = useUsageCalculations();

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
          <SystemStatus />
          <BatteryStatusChart />
        </div>

        {/* Right section - Stats Cards */}
        <div className="xl:w-1/5 space-y-4">
          <InfoCardList usage={usage} />
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
