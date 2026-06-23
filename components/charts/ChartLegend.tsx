import React from "react";

interface ChartLegendProps {
  payload?: { value: string | number; color: string }[];
}

export function ChartLegend({ payload }: ChartLegendProps) {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1.5 text-xs">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
