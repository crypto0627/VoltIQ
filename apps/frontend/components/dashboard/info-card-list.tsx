import { InfoCard } from "@/components/dashboard/info-card";
import { Zap, DollarSign, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface UsageData {
  peakUsage: number;
  offPeakUsage: number;
  midPeakUsage: number;
  totalCost: number;
  todayUsage: number;
  monthlyPeakUsage: number;
  monthlyOffPeakUsage: number;
  monthlyMidPeakUsage: number;
  monthlyTotalCost: number;
  monthlyUsage: number;
}

interface InfoCardListProps {
  usage: UsageData;
}

interface InfoCardItem {
  title: string;
  value: string;
  percentage: string;
  icon: LucideIcon;
  monthlyValue: string;
  monthlyPercentage: string;
}

export function InfoCardList({ usage }: InfoCardListProps) {
  const t = useTranslations("main.dashboard");

  const infoCards: InfoCardItem[] = [
    {
      title: t("electricityBill"),
      value: `$NT ${usage.totalCost}`,
      percentage: "+12% from last day",
      monthlyValue: `$NT ${usage.monthlyTotalCost}`,
      monthlyPercentage: "+8% from last month",
      icon: DollarSign,
    },
    {
      title: t("peakUsage"),
      value: `${usage.peakUsage} kWh`,
      percentage: "+15% from last day",
      monthlyValue: `${usage.monthlyPeakUsage} kWh`,
      monthlyPercentage: "+10% from last month",
      icon: Zap,
    },
    {
      title: t("offPeakUsage"),
      value: `${usage.offPeakUsage} kWh`,
      percentage: "-5% from last day",
      monthlyValue: `${usage.monthlyOffPeakUsage} kWh`,
      monthlyPercentage: "-3% from last month",
      icon: Zap,
    },
    {
      title: t("midPeakUsage"),
      value: `${usage.midPeakUsage} kWh`,
      percentage: "+8% from last day",
      monthlyValue: `${usage.monthlyMidPeakUsage} kWh`,
      monthlyPercentage: "+5% from last month",
      icon: Zap,
    },
    {
      title: t("todaysElectricityUsage"),
      value: `${usage.todayUsage} kWh`,
      percentage: "+18% from last day",
      monthlyValue: `${usage.monthlyUsage} kWh`,
      monthlyPercentage: "+12% from last month",
      icon: Zap,
    },
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
          monthlyValue={card.monthlyValue}
          monthlyPercentage={card.monthlyPercentage}
        />
      ))}
    </>
  );
}
