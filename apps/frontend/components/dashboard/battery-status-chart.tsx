"use client";
import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useElectricityStore } from "@/stores/electricityStore";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Battery, BatteryCharging, BatteryWarning } from "lucide-react";

export default function BatteryStatusChart() {
  const t = useTranslations("main.dashboard");
  const { data, currentTimeIndex, timeLabel, startSimulation, stopSimulation } =
    useElectricityStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const batteryData = useMemo(() => {
    return data.slice(0, currentTimeIndex + 1).map((item) => ({
      time: item.time,
      level: item.soc,
    }));
  }, [data, currentTimeIndex]);

  const getBatteryStatus = useMemo(() => {
    if (currentTimeIndex === 0) return {
      text: t("charging"),
      className: "text-green-500 animate-pulse",
      icon: BatteryCharging
    };
    
    const currentLevel = data[currentTimeIndex]?.soc || 0;
    const prevLevel = data[currentTimeIndex - 1]?.soc || 0;
    
    if (currentLevel === 100) return {
      text: t("standby"),
      className: "text-blue-500",
      icon: Battery
    };
    if (currentLevel > prevLevel) return {
      text: t("charging"),
      className: "text-green-500 animate-pulse",
      icon: BatteryCharging
    };
    if (currentLevel < prevLevel) return {
      text: t("discharging"),
      className: "text-orange-500 animate-bounce",
      icon: BatteryWarning
    };
    return {
      text: t("standby"),
      className: "text-blue-500",
      icon: Battery
    };
  }, [data, currentTimeIndex, t]);

  const StatusIcon = getBatteryStatus.icon;

  return (
    <Card className="shadow-lg bg-card text-card-foreground">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {t("batteryLevel")} {data[currentTimeIndex]?.soc.toFixed(1) || 0}%
          </CardTitle>
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("w-4 h-4", getBatteryStatus.className)} />
            <span className={cn("text-sm font-medium", getBatteryStatus.className)}>
              {getBatteryStatus.text}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={batteryData}
              margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="time"
                domain={timeLabel}
                type="category"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                label={{ value: t("time"), position: "bottom", offset: 15 }}
              />
              <YAxis
                domain={[0, 100]}
                tickCount={6}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value: number) => `${value}%`}
                label={{
                  value: t("batteryLevel"),
                  angle: -90,
                  position: "left",
                  offset: 15,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => {
                  return [`${value.toFixed(1)}%`, t("batteryLevel")];
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                payload={[
                  {
                    value: t("batteryLevel"),
                    type: "rect",
                    color: "hsl(var(--chart-2))",
                  },
                ]}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#colorBattery)"
                fillOpacity={1}
                name={t("batteryLevel")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
