"use client";
import { useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useElectricityStore } from "@/stores/electricityStore";
import { useTranslations } from "next-intl";

export default function ChargeChart() {
  const t = useTranslations("main.dashboard");
  const { data, currentTimeIndex, timeLabel, startSimulation, stopSimulation } =
    useElectricityStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const chargeData = useMemo(() => {
    return data.slice(0, currentTimeIndex + 1).map((item) => ({
      time: item.time,
      charge: item.batteryUsage,
      charging: item.batteryUsage > 0 ? item.batteryUsage : 0,
      discharging: item.batteryUsage < 0 ? item.batteryUsage : 0,
    }));
  }, [data, currentTimeIndex]);

  return (
    <Card className="shadow-lg bg-card text-card-foreground">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl font-semibold">
          {t("batteryChargeDischarge")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chargeData}
              margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
            >
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
                domain={[-1500, 1500]}
                tickCount={7}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value: number) => `${value}`}
                label={{
                  value: t("power"),
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
                formatter={(value: number, name: string) => {
                  if (value === 0) return null;
                  return [
                    `${Math.abs(value)} kW`,
                    name === "charging" ? t("charging") : t("discharging"),
                  ];
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                payload={[
                  {
                    value: t("charging"),
                    type: "rect",
                    color: "hsl(var(--chart-2))",
                  },
                  {
                    value: t("discharging"),
                    type: "rect",
                    color: "hsl(var(--chart-1))",
                  },
                ]}
              />
              <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1} />
              <Bar
                dataKey="charging"
                fill="hsl(var(--chart-2))"
                name={t("charging")}
                isAnimationActive={false}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="discharging"
                fill="hsl(var(--chart-1))"
                name={t("discharging")}
                isAnimationActive={false}
                radius={[0, 0, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
