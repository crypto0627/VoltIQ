'use client'
import { useEffect, useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useElectricityStore } from '@/stores/electricityStore';

type UsageData = {
  time: string;
  usage: number;
};

export default function ElectricityUsageChart() {
  const { data, currentTimeIndex, timeLabel, startSimulation, stopSimulation } = useElectricityStore();

  useEffect(() => {
    // This useEffect is now only responsible for starting and stopping the simulation
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const displayData = useMemo(() => {
    // Slice the data based on the current animation step
    return data.slice(0, currentTimeIndex + 1).map(item => ({
      time: item.time,
      usage: item.powerUsage,
    }));
  }, [data, currentTimeIndex]);

  // Calculate max usage for Y axis based on the full data available in the store
  const maxUsage = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(...data.map(item => item.powerUsage));
  }, [data]);

  // Calculate max usage for Y axis
  const yAxisMax = Math.ceil(maxUsage / 100) * 100 + 1000; // Round up to nearest hundred

  return (
    <Card className="shadow-lg bg-card text-card-foreground">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl font-semibold">Daily Electricity Usage</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 30, left: 30, bottom: 30 }}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorOverusage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                domain={timeLabel}
                type="category"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                label={{ value: 'Time', position: 'bottom', offset: 15 }}
              />
              <YAxis
                domain={[0, yAxisMax]}
                tickCount={6}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value: number) => `${value.toLocaleString()}`}
                label={{ value: 'Usage (kWh)', angle: -90, position: 'left', offset: 15 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => {
                  return [`${value.toLocaleString()} kWh`, 'Usage'];
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                payload={[
                  { value: 'Electricity Usage', type: 'rect', color: 'hsl(var(--chart-1))' },
                  { value: 'Contract Limit 2000 kW', type: 'line', color: 'hsl(var(--destructive))' },
                ]}
              />
              <Area
                type="monotone"
                dataKey="usage"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#colorUsage)"
                fillOpacity={1}
                name="Electricity Usage"
              />
              <ReferenceLine y={2000} stroke="hsl(var(--destructive))" strokeDasharray="3 3" name="Contract Limit 2000 kW" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
