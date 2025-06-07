'use client'
import { useEffect, useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useElectricityStore } from '@/stores/electricityStore';

type ChargeData = {
  time: string;
  charge: number;
};

export default function ChargeChart() {
  const { data, currentTimeIndex, timeLabel, startSimulation, stopSimulation } = useElectricityStore();

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);

  const chargeData = useMemo(() => {
    return data.slice(0, currentTimeIndex + 1).map(item => ({
      time: item.time,
      charge: item.batteryUsage,
    }));
  }, [data, currentTimeIndex]);

  return (
    <Card className="shadow-lg bg-card text-card-foreground">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl font-semibold">Battery Charge/Discharge</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chargeData} margin={{ top: 10, right: 30, left: 30, bottom: 30 }}>
              <defs>
                <linearGradient id="colorCharge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDischarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1}/>
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
                domain={[-1500, 1500]}
                tickCount={7}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value: number) => `${value}`}
                label={{ value: 'Power(kW)', angle: -90, position: 'left', offset: 15 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => {
                  return [`${value} kW`, value >= 0 ? 'Charging' : 'Discharging'];
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                payload={[
                  { value: 'Charging', type: 'rect', color: 'hsl(var(--chart-3))' },
                  { value: 'Discharging', type: 'rect', color: 'hsl(var(--chart-4))' },
                ]}
              />
              <Area
                type="monotone"
                dataKey="charge"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                fill="url(#colorCharge)"
                fillOpacity={1}
                name="Charging"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="charge"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                fill="url(#colorDischarge)"
                fillOpacity={1}
                name="Discharging"
                isAnimationActive={false}
                baseValue={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
