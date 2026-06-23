import React from "react";
import { ChartEmptyState } from "./ChartEmptyState";

interface ProgressListProps {
  data: Record<string, string | number>[];
  nameKey: string;
  dataKey: string;
  color?: string;
}

export function ProgressList({ data, nameKey, dataKey, color = "bg-primary" }: ProgressListProps) {
  if (!data || data.length === 0) return <ChartEmptyState />;

  const maxVal = Math.max(...data.map((d) => Number(d[dataKey]) || 0));

  return (
    <div className="flex flex-col gap-4 w-full h-full justify-center">
      {data.map((item, index) => {
        const val = Number(item[dataKey]) || 0;
        const percentage = maxVal > 0 ? (val / maxVal) * 100 : 0;
        
        return (
          <div key={index} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-foreground truncate mr-4">{item[nameKey]}</span>
              <span className="text-muted-foreground font-semibold">{val}</span>
            </div>
            {/* Custom progress bar to support arbitrary colors if needed, but we can use inline styles for the indicator */}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${color}`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
