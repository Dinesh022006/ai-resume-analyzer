import React from "react";

interface ChartToolbarProps {
  title: string;
}

export function ChartToolbar({ title }: ChartToolbarProps) {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
    </div>
  );
}
