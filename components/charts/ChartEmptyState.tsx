import React from "react";
import { BarChart2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ChartEmptyStateProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function ChartEmptyState({ 
  icon: Icon = BarChart2,
  title = "Not enough data",
  description = "Analyze more resumes to unlock this chart.",
  ctaText = "Analyze Resume",
  ctaLink = "/dashboard/upload"
}: ChartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[250px] w-full text-center px-6 bg-muted/10 rounded-xl border border-dashed border-border/50">
      <div className="p-3 bg-primary/10 rounded-full mb-3">
        {Icon ? <Icon className="h-6 w-6 text-primary/70" /> : <BarChart2 className="h-6 w-6 text-primary/70" />}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-[250px]">{description}</p>
      {ctaText && ctaLink && (
        <Link href={ctaLink}>
          <Button variant="outline" size="sm" className="rounded-full shadow-sm">
            {ctaText}
          </Button>
        </Link>
      )}
    </div>
  );
}
