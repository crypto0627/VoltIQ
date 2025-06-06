'use client'
import { useEffect, useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useElectricityStore } from '@/stores/electricityStore';

type BatteryData = {
  time: string;
  level: number;
};

export default function BatteryStatusChart() {
  const { data, currentTimeIndex, timeLabel, startSimulation, stopSimulation } = useElectricityStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const batteryData = useMemo(() => {
    return data.slice(0, currentTimeIndex + 1).map(item => ({
      time: item.time,
      level: item.soc,
    }));
  }, [data, currentTimeIndex]);

  return (
    <Card className="shadow-lg bg-card text-card-foreground">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl font-semibold">Battery Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={batteryData} margin={{ top: 10, right: 30, left: 30, bottom: 30 }}>
              <defs>
                <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
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
                domain={[0, 100]}
                tickCount={6}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value: number) => `${value}%`}
                label={{ value: 'Battery Level', angle: -90, position: 'left', offset: 15 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => {
                  return [`${value.toFixed(1)}%`, 'Battery Level'];
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                payload={[
                  { value: 'Battery Level', type: 'rect', color: 'hsl(var(--chart-2))' },
                ]}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#colorBattery)"
                fillOpacity={1}
                name="Battery Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
