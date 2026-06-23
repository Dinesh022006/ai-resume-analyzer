import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-11 w-48 rounded-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm rounded-2xl border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm rounded-2xl border-border/50">
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-1" />
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[250px]">
              <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <span className="text-sm">Loading analytics from Neon Database...</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
