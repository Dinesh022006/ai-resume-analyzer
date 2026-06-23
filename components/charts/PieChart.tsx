"use client";

import React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartEmptyState } from "./ChartEmptyState";
import { ChartLegend } from "./ChartLegend";

interface PieChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

const DEFAULT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PieChart({ data, dataKey, nameKey, colors = DEFAULT_COLORS }: PieChartProps) {
  if (!data || data.length === 0) return <ChartEmptyState />;

  return (
    <div className="h-[280px] w-full flex flex-col">
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              labelLine={false}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend payload={data.map((d, i) => ({ value: d[nameKey], color: colors[i % colors.length] }))} />
    </div>
  );
}
