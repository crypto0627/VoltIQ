import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  value: string;
  percentage: string;
  icon: LucideIcon;
  monthlyValue?: string;
  monthlyPercentage?: string;
}

export function InfoCard({
  title,
  value,
  percentage,
  icon: Icon,
  monthlyValue,
  monthlyPercentage,
}: InfoCardProps) {
  const t = useTranslations("main.dashboard");
  const isDollarSign = Icon === DollarSign;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="relative group">
          <Icon 
            className={cn(
              "h-6 w-6 transition-all duration-1000",
              isDollarSign 
                ? "animate-mirror text-gold group-hover:animate-none hover:text-gold-light" 
                : "text-muted-foreground hover:text-primary"
            )} 
          />
          {isDollarSign && (
            <div className="absolute inset-0 bg-gradient-to-r from-gold-light/20 to-gold-dark/20 blur-sm rounded-full" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {monthlyValue && (
          <>
            <div className="text-2xl font-bold">{monthlyValue}</div>
            <p className="text-xs text-muted-foreground mb-2">{monthlyPercentage}</p>
          </>
        )}
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-muted-foreground">{value}</div>
          <span className="text-xs text-muted-foreground">{t("today")}</span>
        </div>
        <p className="text-xs text-muted-foreground">{percentage}</p>
      </CardContent>
    </Card>
  );
}
