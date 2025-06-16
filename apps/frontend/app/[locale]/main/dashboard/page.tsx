"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiChatModal } from "@/components/ai-chat-modal";
import Image from "next/image";
import ElectricityUsageChart from "@/components/dashboard/daily-usage";
import BatteryStatusChart from "@/components/dashboard/battery-status-chart";
import ChargeChart from "@/components/dashboard/charge-chart";
import SystemStatus from "@/components/dashboard/system-status";
import { useElectricityStore } from "@/stores/electricityStore";
import { useUsageCalculations } from "@/hooks/use-usage-calculations";
import { InfoCardList } from "@/components/dashboard/info-card-list";
import { SaveMoney } from "@/components/dashboard/save-money";

export default function DashboardPage() {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const { startSimulation, stopSimulation } = useElectricityStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const usage = useUsageCalculations();

  return (
    <div className="space-y-0">
      {/* Info Cards Section */}
      <div className="flex flex-col xl:flex-row gap-0.5">
        <div className="xl:w-1/2 space-y-0.5">
          <InfoCardList usage={usage} />
        </div>
        <div className="xl:w-1/2 space-y-0.5">
          <SaveMoney />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-0.5">
        {/* Left section */}
        <div className="xl:w-1/2 space-y-0.5">
          {/* Electricity Usage Overview Card */}
          <ElectricityUsageChart />
          <ChargeChart />
        </div>

        {/* Middle section */}
        <div className="xl:w-1/2 space-y-0.5">
          <SystemStatus />
          <BatteryStatusChart />
        </div>
      </div>

      <Button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full p-0 border-3 border-blue-500/40"
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
