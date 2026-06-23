"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTransition, useState, useEffect, useCallback } from "react";

export function HistoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentFilter = searchParams.get("filter") || "All";
  const currentSort = searchParams.get("sort") || "Newest";

  const [searchValue, setSearchValue] = useState(currentSearch);

  const updateParams = useCallback((newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(newParams).forEach(key => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [searchParams, router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateParams({ search: searchValue, page: "1" });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, updateParams]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-9 bg-background" 
          placeholder="Search resumes..." 
        />
      </div>

      <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        <select 
          value={currentFilter}
          onChange={(e) => updateParams({ filter: e.target.value, page: "1" })}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="All">All Scores</option>
          <option value="Excellent">Excellent (90+)</option>
          <option value="Good">Good (75-89)</option>
          <option value="Average">Average (60-74)</option>
          <option value="Needs Improvement">Needs Improvement (&lt;60)</option>
        </select>

        <select 
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value, page: "1" })}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
          <option value="Highest ATS">Highest ATS</option>
          <option value="Lowest ATS">Lowest ATS</option>
          <option value="Highest Job Match">Highest Job Match</option>
        </select>
      </div>

      {isPending && <span className="text-xs text-muted-foreground animate-pulse ml-auto">Updating...</span>}
    </div>
  );
}
