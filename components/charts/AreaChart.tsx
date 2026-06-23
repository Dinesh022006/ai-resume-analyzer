"use client";

import React from "react";
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartEmptyState } from "./ChartEmptyState";

interface AreaChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  categoryKey: string;
  color?: string;
}

export function AreaChart({ data, dataKey, categoryKey, color = "#6366f1" }: AreaChartProps) {
  if (!data || data.length === 0) return <ChartEmptyState />;

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey={categoryKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#888888" }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#888888" }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: "#1f2937", fontWeight: 500 }}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#gradient-${dataKey})`} 
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
