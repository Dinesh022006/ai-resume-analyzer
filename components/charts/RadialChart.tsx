"use client";

import React from "react";
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from "recharts";

interface RadialChartProps {
  value: number;
  max?: number;
  label: string;
  color?: string;
}

export function RadialChart({ value, max = 100, label, color = "#6366f1" }: RadialChartProps) {
  const data = [{ name: label, value, fill: color }];

  return (
    <div className="h-[250px] w-full relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="90%" 
          barSize={15} 
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, max]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#e5e7eb' }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-extrabold tracking-tight" style={{ color }}>{value}</span>
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{label}</span>
      </div>
    </div>
  );
}
