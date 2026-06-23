"use client";

import React from "react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartEmptyState } from "./ChartEmptyState";

interface BarChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  categoryKey: string;
  color?: string;
}

export function BarChart({ data, dataKey, categoryKey, color = "#6366f1" }: BarChartProps) {
  if (!data || data.length === 0) return <ChartEmptyState />;

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 50 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey={categoryKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#888888", angle: -45, textAnchor: 'end' }} 
            dy={20} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#888888" }} 
          />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={24} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
