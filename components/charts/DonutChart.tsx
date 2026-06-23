"use client";

import React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartEmptyState } from "./ChartEmptyState";
import { ChartLegend } from "./ChartLegend";

interface DonutChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

const DEFAULT_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#3b82f6"];

export function DonutChart({ data, dataKey, nameKey, colors = DEFAULT_COLORS }: DonutChartProps) {
  if (!data || data.length === 0) return <ChartEmptyState />;

  return (
    <div className="h-[300px] w-full flex flex-col items-center">
      <div className="w-full flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey={dataKey}
              nameKey={nameKey}
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
      <div className="w-full px-2 mt-2 overflow-hidden flex flex-wrap justify-center gap-y-1">
        <ChartLegend payload={data.map((d, i) => ({ value: d[nameKey], color: colors[i % colors.length] }))} />
      </div>
    </div>
  );
}
