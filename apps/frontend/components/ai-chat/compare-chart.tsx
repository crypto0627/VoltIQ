import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CompareChartProps {
  data: any[];
  chartConfig: {
    xAxisDataKey: string;
    line1DataKey: string;
    line2DataKey: string;
    line1Name: string;
    line2Name: string;
    tooltipLabel: string;
    tooltipValueLabel: string;
  };
}

export function CompareChart({ data, chartConfig }: CompareChartProps) {
  return (
    <ResponsiveContainer width="105%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 40,
          right: 50,
          left: 60,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis dataKey={chartConfig.xAxisDataKey} stroke="#e2e8f0" />
        <YAxis
          stroke="#e2e8f0"
          tickFormatter={(value) => `${value.toLocaleString("zh-TW")}`}
          label={{
            value: "用電量 (kW)",
            angle: -90,
            position: "insideLeft",
            fill: "#e2e8f0",
            dx: -40,
            dy: 50
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#334155",
            border: "none",
            borderRadius: "4px",
          }}
          labelStyle={{ color: "#e2e8f0" }}
          itemStyle={{ color: "#94a3b8" }}
          formatter={(value: number, name: string) => [
            value.toLocaleString("zh-TW"),
            name,
          ]}
          labelFormatter={(label: string) =>
            `${chartConfig.tooltipLabel || ""}${label}`
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={chartConfig.line1DataKey}
          stroke="#60a5fa"
          activeDot={{ r: 5, fill: "#60a5fa", stroke: "#e2e8f0" }}
          name={chartConfig.line1Name}
        />
        <Line
          type="monotone"
          dataKey={chartConfig.line2DataKey}
          stroke="#f87171"
          activeDot={{ r: 5, fill: "#f87171", stroke: "#e2e8f0" }}
          name={chartConfig.line2Name}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 