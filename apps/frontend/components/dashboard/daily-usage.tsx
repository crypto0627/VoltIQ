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
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useElectricityStore } from "@/stores/electricityStore";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function ElectricityUsageChart() {
  const t = useTranslations("main.dashboard");
  const { data, currentTimeIndex, timeLabel, startSimulation, stopSimulation } =
    useElectricityStore();
  const [overUsageData, setOverUsageData] = useState<
    { time: string; usage: number }[]
  >([]);

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  useEffect(() => {
    // Calculate over usage data whenever data changes
    const overUsage = data
      .filter((item) => item.powerUsage > 2000)
      .map((item) => ({
        time: item.time,
        usage: item.powerUsage,
      }));
    setOverUsageData(overUsage);
  }, [data]);

  const displayData = useMemo(() => {
    return data.slice(0, currentTimeIndex + 1).map((item) => ({
      time: item.time,
      usage: item.powerUsage,
    }));
  }, [data, currentTimeIndex]);

  const maxUsage = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((item) => item.powerUsage));
  }, [data]);

  const yAxisMax = Math.ceil(maxUsage / 100) * 100 + 1000;

  return (
    <Card className="shadow-lg bg-card text-card-foreground">
      <CardHeader className="border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          {t("dailyElectricityUsage")}
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              {t("overUsage")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("overUsageRecords")}</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t("time")}</th>
                    <th className="text-right p-2">{t("usage")}</th>
                  </tr>
                </thead>
                <tbody>
                  {overUsageData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.time}</td>
                      <td className="text-right p-2 text-destructive">
                        {item.usage.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorOverusage" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--destructive))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--destructive))"
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
                domain={[0, yAxisMax]}
                tickCount={6}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value: number) => `${value.toLocaleString()}`}
                label={{
                  value: t("usage"),
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
                  return [
                    `${value.toLocaleString()} kWh`,
                    t("electricityUsage"),
                  ];
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                payload={[
                  {
                    value: t("electricityUsage"),
                    type: "rect",
                    color: "hsl(var(--chart-1))",
                  },
                  {
                    value: t("contractLimit"),
                    type: "line",
                    color: "hsl(var(--destructive))",
                  },
                ]}
              />
              <Area
                type="monotone"
                dataKey="usage"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#colorUsage)"
                fillOpacity={1}
                name={t("electricityUsage")}
              />
              <ReferenceLine
                y={2000}
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
                name={t("contractLimit")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
