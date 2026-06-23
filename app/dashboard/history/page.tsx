import { Download, Trash2, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAnalysesHistory } from "@/lib/actions";
import { HistoryFilters } from "@/components/HistoryFilters";
import { HistoryPagination } from "@/components/HistoryPagination";
import { Suspense } from "react";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const search = params.search || "";
  const filter = params.filter || "All";
  const sort = params.sort || "Newest";
  const page = parseInt(params.page || "1", 10) || 1;
  const pageSize = 10;

  const { analyses, totalCount } = await getAnalysesHistory(search, filter, sort, page, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analysis History</h1>
          <p className="text-muted-foreground mt-1 text-lg">Track your progress and review past resume feedback.</p>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-2xl pb-6">
          <CardTitle>Analyzed Resumes</CardTitle>
          <CardDescription className="mt-1 mb-4">A comprehensive list of all resumes you have uploaded.</CardDescription>
          
          <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded-md w-full" />}>
            <HistoryFilters />
          </Suspense>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="py-4 pl-6">File Name</TableHead>
                  <TableHead>Target Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No analyses found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  analyses.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors border-border/40">
                      <TableCell className="font-medium pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="truncate max-w-[200px] block" title={item.resume.fileName}>
                            {item.resume.fileName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-[150px]" title={item.resume.title || "N/A"}>
                        {item.resume.title || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{format(item.createdAt, "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            <span className={`font-bold text-lg ${item.atsScore >= 80 ? 'text-emerald-600 dark:text-emerald-500' : item.atsScore >= 70 ? 'text-amber-600 dark:text-amber-500' : 'text-red-600 dark:text-red-500'}`}>
                              {item.atsScore}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">/100</span>
                          </span>
                          {item.jobMatchScore !== null && (
                            <span className="text-[10px] font-medium text-muted-foreground">Match: {item.jobMatchScore}%</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={`rounded-full px-3 py-1 font-medium capitalize whitespace-nowrap ${
                            item.atsScore >= 80 
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                              : item.atsScore >= 70 
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                          }`}
                        >
                          {item.overallRating}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/dashboard/analysis/${item.id}`}>
                            <Button variant="ghost" size="icon" title="View Analysis" className="rounded-full hover:bg-primary/10 hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* We don't have download or delete implemented fully in UI yet, leaving as placeholders */}
                          <Button variant="ghost" size="icon" title="Download Report" className="rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-50">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" className="rounded-full hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <Suspense fallback={<div className="h-10" />}>
            <HistoryPagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
