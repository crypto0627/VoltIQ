'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useElectricityStore } from "@/stores/electricityStore";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTranslations } from "next-intl";

export default function SchedulePage() {
  const t = useTranslations("main.schedule");
  const { data, currentTimeIndex, startSimulation, stopSimulation } = useElectricityStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const calculatePrice = (usage: number) => {
    return usage * 0.1;
  };

  const processedData = data.map(item => ({
    ...item,
    charging: item.batteryUsage > 0 ? item.batteryUsage : 0,
    discharging: item.batteryUsage < 0 ? item.batteryUsage : 0
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: t("time"), position: "bottom", offset: 15 }}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  label={{ value: t("batteryUsage"), angle: -90, position: 'insideLeft' }}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    color: "hsl(var(--foreground))"
                  }}
                />
                <Bar 
                  dataKey="charging" 
                  name={t("charging")} 
                  fill="hsl(var(--chart-3))" 
                  stackId="stack"
                />
                <Bar 
                  dataKey="discharging" 
                  name={t("discharging")} 
                  fill="hsl(var(--chart-4))" 
                  stackId="stack"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("updateInterval")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("time")}</TableHead>
                <TableHead>{t("batteryUsage")}</TableHead>
                <TableHead>{t("electricityPrice")}</TableHead>
                <TableHead>{t("electricityCost")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.batteryUsage}</TableCell>
                  <TableCell>0.1</TableCell>
                  <TableCell>{calculatePrice(item.batteryUsage).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
