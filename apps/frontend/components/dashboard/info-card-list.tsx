import { InfoCard } from "@/components/dashboard/info-card";
import { Zap, DollarSign, LucideIcon } from "lucide-react";

interface UsageData {
  peakUsage: number;
  offPeakUsage: number;
  midPeakUsage: number;
  totalCost: number;
  todayUsage: number;
}

interface InfoCardListProps {
  usage: UsageData;
}

interface InfoCardItem {
  title: string;
  value: string;
  percentage: string;
  icon: LucideIcon;
}

export function InfoCardList({ usage }: InfoCardListProps) {
  const infoCards: InfoCardItem[] = [
    {
      title: "Peak Usage",
      value: `${usage.peakUsage} kWh`,
      percentage: "+15% from last day",
      icon: Zap
    },
    {
      title: "Off-Peak Usage",
      value: `${usage.offPeakUsage} kWh`,
      percentage: "-5% from last day",
      icon: Zap
    },
    {
      title: "Mid-Peak Usage",
      value: `${usage.midPeakUsage} kWh`,
      percentage: "+8% from last day",
      icon: Zap
    },
    {
      title: "Electricity Bill",
      value: `$NT ${usage.totalCost}`,
      percentage: "+12% from last day",
      icon: DollarSign
    },
    {
      title: "Today's electricity usage",
      value: `${usage.todayUsage} kWh`,
      percentage: "+18% from last day",
      icon: Zap
    }
  ];

  return (
    <>
      {infoCards.map((card, index) => (
        <InfoCard
          key={index}
          title={card.title}
          value={card.value}
          percentage={card.percentage}
          icon={card.icon}
        />
      ))}
    </>
  );
}
