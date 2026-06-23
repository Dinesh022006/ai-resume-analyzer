"use client";

import React from "react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartEmptyState } from "./ChartEmptyState";

interface HorizontalBarChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  categoryKey: string;
  color?: string;
}

export function HorizontalBarChart({ data, dataKey, categoryKey, color = "#6366f1" }: HorizontalBarChartProps) {
  if (!data || data.length === 0) return <ChartEmptyState />;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis 
            type="number"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#888888" }} 
          />
          <YAxis 
            type="category"
            dataKey={categoryKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#888888" }} 
            width={120}
            tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 13)}...` : value}
          />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} barSize={20} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
