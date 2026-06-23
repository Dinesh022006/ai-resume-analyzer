import Link from "next/link";
import { FileText, TrendingUp, Award, ArrowRight, Activity, Calendar, Target, FileSearch } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getDashboardAnalytics } from "@/lib/analytics";
import { 
  AreaChart, PieChart, DonutChart, RadialChart, 
  ChartCard, ChartEmptyState, ProgressList
} from "@/components/charts";
import { LineChart, PieChart as PieChartIcon } from "lucide-react";

export default async function DashboardOverview() {
  const analytics = await getDashboardAnalytics();
  const { kpis, charts, recentAnalyses } = analytics;
  const recent = recentAnalyses[0]; // Recent Analysis Card

  const statCards = [
    { title: "Total Resumes", value: kpis.totalResumes, icon: FileText, color: "text-blue-500", bg: "from-blue-500/20", tooltip: "Total distinct resumes uploaded." },
    { title: "Total Analyses", value: kpis.totalAnalyses, icon: Activity, color: "text-indigo-500", bg: "from-indigo-500/20", tooltip: "Number of completed AI analyses." },
    { title: "Highest ATS", value: kpis.highestAtsScore, icon: Award, color: "text-emerald-500", bg: "from-emerald-500/20", tooltip: "The highest ATS score achieved." },
    { title: "Lowest ATS", value: kpis.lowestAtsScore, icon: TrendingUp, color: "text-rose-500", bg: "from-rose-500/20", tooltip: "The lowest ATS score achieved." },
    { title: "Avg Job Match", value: `${kpis.avgJobMatchScore}%`, icon: Target, color: "text-amber-500", bg: "from-amber-500/20", tooltip: "Average resume compatibility with uploaded job descriptions." },
    { title: "Last Analysis", value: kpis.lastAnalysisDate || "Never", icon: Calendar, color: "text-purple-500", bg: "from-purple-500/20", tooltip: "Date of the most recent analysis." },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time insights generated from your resume history.</p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 h-11 px-6">
            <FileText className="mr-2 h-4 w-4" /> Analyze New Resume
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat, i) => (
          <Card key={i} className={`shadow-sm rounded-2xl border-border/50 relative overflow-hidden group`} title={stat.tooltip}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 px-4 pt-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm ${stat.color}`}>
                <stat.icon className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 px-4 pb-4">
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Row 1 */}
        <ChartCard title="ATS Score Trend" description="Your progress over time" className="col-span-1 lg:col-span-2 min-h-[240px]">
          {(kpis.totalAnalyses < 5 || charts.atsTrend.length <= 1) ? (
            <ChartEmptyState 
              icon={LineChart} 
              title="Not enough historical data" 
              description="Analyze more resumes over time to visualize your ATS score trend." 
            />
          ) : (
            <AreaChart data={charts.atsTrend} dataKey="score" categoryKey="date" color="#6366f1" />
          )}
        </ChartCard>

        <ChartCard title="Average ATS Score" description="Overall resume strength" className="min-h-[240px]">
          <RadialChart value={kpis.avgAtsScore} max={100} label="Avg Score" color="#10b981" />
        </ChartCard>

        {/* Row 2 */}
        <ChartCard title="Resume Quality" description="Distribution of score brackets" className="min-h-[280px]">
          {charts.resumeQuality.length <= 1 ? (
            <ChartEmptyState 
              icon={PieChartIcon} 
              title="Resume Quality Distribution" 
              description="Complete analyses with different resumes to see score distribution. The chart becomes available once your analyses span multiple score ranges." 
              ctaText="Analyze Another Resume" 
            />
          ) : (
            <PieChart data={charts.resumeQuality} dataKey="value" nameKey="name" />
          )}
        </ChartCard>

        <ChartCard title="Recommended Roles" description="Most frequent role matches" className="min-h-[280px]">
          <DonutChart data={charts.rolesDistribution} dataKey="value" nameKey="name" />
        </ChartCard>

        {/* Recent Analysis Card */}
        <Card className="shadow-sm rounded-2xl border-border/50 flex flex-col min-h-[280px]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-primary" /> Recent Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center text-center px-6">
            {recent ? (
              <div className="space-y-4 w-full">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <p className="font-bold text-lg mb-1 truncate">{recent.resume.title || recent.resume.fileName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(recent.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-around items-center">
                  <div>
                    <p className="text-3xl font-extrabold text-emerald-500">{recent.atsScore}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">ATS Score</p>
                  </div>
                  <div className="w-px h-10 bg-border"></div>
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold text-amber-500 whitespace-nowrap">{recent.jobMatchScore ?? 'No Job Description'}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Job Match</p>
                  </div>
                </div>
                <Link href={`/dashboard/analysis/${recent.id}`} className="block w-full pt-2">
                  <Button variant="default" className="w-full rounded-full">
                    View Report <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <ChartEmptyState 
                title="No recent analyses" 
                description="Your recent analyses will appear here." 
                ctaText="Start Analysis"
              />
            )}
          </CardContent>
        </Card>

        {/* Row 3 */}
        <ChartCard title="Top Missing Technical Skills" description="Frequency across all analyses" className="col-span-1 lg:col-span-2 min-h-[280px]">
          <ProgressList data={charts.missingTechnicalSkills} dataKey="count" nameKey="skill" color="bg-amber-500" />
        </ChartCard>

        <ChartCard title="Top Missing Keywords" description="Keywords missed most often" className="min-h-[280px]">
          <ProgressList data={charts.missingKeywords} dataKey="count" nameKey="keyword" color="bg-rose-500" />
        </ChartCard>
      </div>
    </div>
  );
}
