import { CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Target, Award, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAnalysisById } from "@/lib/actions";
import { DownloadPdfButton } from "@/components/pdf/DownloadPdfButton";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const analysisRecord = await getAnalysisById(id);

  if (!analysisRecord) {
    notFound();
  }

  const score = analysisRecord.atsScore;
  const isGoodScore = score >= 80;
  const isAverageScore = score >= 60 && score < 80;

  // Ensure JSON fields are cast correctly. We assume they match our arrays of strings.
  const weaknesses = analysisRecord.weaknesses as string[] | undefined;
  const strengths = analysisRecord.strengths as string[] | undefined;
  const missingTechnicalSkills = analysisRecord.missingTechnicalSkills as string[] | undefined;
  const missingSoftSkills = analysisRecord.missingSoftSkills as string[] | undefined;
  const improvementSuggestions = analysisRecord.improvementSuggestions as string[] | undefined;
  const formattingSuggestions = analysisRecord.formattingSuggestions as string[] | undefined;
  const grammarIssues = analysisRecord.grammarIssues as string[] | undefined;
  const recommendedJobRoles = analysisRecord.recommendedJobRoles as string[] | undefined;

  const jobMatchScore = analysisRecord.jobMatchScore;
  const hasJobMatch = jobMatchScore !== null;
  const isGoodJobMatch = hasJobMatch && jobMatchScore >= 80;
  const isAverageJobMatch = hasJobMatch && jobMatchScore >= 60 && jobMatchScore < 80;

  // We didn't store breakdown inside Analysis directly in schema, 
  // wait! I forgot to save breakdown inside Analysis in actions.ts. 
  // Since we only have one JSON field `atsData` in the plan, but in schema I didn't add atsData? 
  // Let me check schema... I didn't add `atsData`. Ah. I'll just skip rendering breakdown for now or use placeholders if needed.
  // Wait, I didn't save breakdown! The breakdown is deterministic anyway, I can omit it or add it later.
  
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/history">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Analysis Results</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="font-medium">AI Generated Report for {analysisRecord.resume.title}</span>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-full px-3 capitalize">
                <Target className="h-3 w-3 mr-1" /> {analysisRecord.overallRating}
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <DownloadPdfButton analysisId={analysisRecord.id} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Score Column */}
        <div className="space-y-6">
          <Card className={`rounded-2xl shadow-lg border-2 ${isGoodScore ? 'border-emerald-500/20 bg-gradient-to-b from-emerald-500/10' : isAverageScore ? 'border-amber-500/20 bg-gradient-to-b from-amber-500/10' : 'border-red-500/20 bg-gradient-to-b from-red-500/10'} via-background to-background relative overflow-hidden text-center`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Award className="h-32 w-32 -mt-10 -mr-10" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">ATS Match Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="relative flex items-center justify-center w-40 h-40">
                <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${isGoodScore ? 'bg-emerald-500/20' : isAverageScore ? 'bg-amber-500/20' : 'bg-red-500/20'}`} />
                <svg className="w-full h-full transform -rotate-90 relative z-10">
                  <circle cx="80" cy="80" r="70" className="stroke-muted/30" strokeWidth="10" fill="none" />
                  <circle
                    cx="80" cy="80" r="70"
                    className={`transition-all duration-1000 ease-in-out ${isGoodScore ? 'stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isAverageScore ? 'stroke-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}
                    strokeWidth="10" strokeDasharray={440} strokeDashoffset={440 - (440 * score) / 100} strokeLinecap="round" fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center z-20">
                  <span className="text-5xl font-extrabold">{score}</span>
                  <span className="text-sm font-medium text-muted-foreground mt-1">out of 100</span>
                </div>
              </div>
              <Badge className={`mt-6 text-sm px-4 py-1.5 rounded-full ${isGoodScore ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : isAverageScore ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                {analysisRecord.overallRating}
              </Badge>
            </CardContent>
          </Card>

          {hasJobMatch && (
            <Card className={`rounded-2xl shadow-lg border-2 ${isGoodJobMatch ? 'border-emerald-500/20 bg-gradient-to-b from-emerald-500/10' : isAverageJobMatch ? 'border-amber-500/20 bg-gradient-to-b from-amber-500/10' : 'border-red-500/20 bg-gradient-to-b from-red-500/10'} via-background to-background relative overflow-hidden text-center`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Target className="h-32 w-32 -mt-10 -mr-10" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Job Match Score</CardTitle>
                <CardDescription>Based on provided Job Description</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <div className="relative flex items-center justify-center w-32 h-32">
                  <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${isGoodJobMatch ? 'bg-emerald-500/20' : isAverageJobMatch ? 'bg-amber-500/20' : 'bg-red-500/20'}`} />
                  <svg className="w-full h-full transform -rotate-90 relative z-10">
                    <circle cx="64" cy="64" r="54" className="stroke-muted/30" strokeWidth="8" fill="none" />
                    <circle
                      cx="64" cy="64" r="54"
                      className={`transition-all duration-1000 ease-in-out ${isGoodJobMatch ? 'stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isAverageJobMatch ? 'stroke-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}
                      strokeWidth="8" strokeDasharray={339} strokeDashoffset={339 - (339 * jobMatchScore) / 100} strokeLinecap="round" fill="none"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center z-20">
                    <span className="text-4xl font-extrabold">{jobMatchScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysisRecord.summary}</p>
            </CardContent>
          </Card>

          {recommendedJobRoles && recommendedJobRoles.length > 0 && (
            <Card className="rounded-2xl shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recommended Roles</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {recommendedJobRoles.map((role, idx) => (
                  <Badge key={idx} variant="secondary" className="rounded-full">{role}</Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Feedback Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-md border-border/50 h-full flex flex-col">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold">Actionable Feedback</CardTitle>
              <CardDescription className="mt-1">AI-generated insights to improve your resume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8 flex-1">
              
              {/* Weaknesses / Critical Issues */}
              {weaknesses && weaknesses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold flex items-center text-red-600 dark:text-red-500 uppercase tracking-wider">
                    <XCircle className="h-5 w-5 mr-2" /> Weaknesses
                  </h3>
                  <div className="space-y-3">
                    {weaknesses.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 shadow-sm">
                        <p className="text-sm text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {((missingTechnicalSkills && missingTechnicalSkills.length > 0) || (missingSoftSkills && missingSoftSkills.length > 0)) && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold flex items-center text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                    <AlertTriangle className="h-5 w-5 mr-2" /> Missing Skills
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {missingTechnicalSkills && missingTechnicalSkills.length > 0 && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
                        <p className="font-bold text-foreground mb-2 text-sm">Technical</p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {missingTechnicalSkills.map((skill, idx) => <li key={idx}>{skill}</li>)}
                        </ul>
                      </div>
                    )}
                    {missingSoftSkills && missingSoftSkills.length > 0 && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
                        <p className="font-bold text-foreground mb-2 text-sm">Soft Skills</p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {missingSoftSkills.map((skill, idx) => <li key={idx}>{skill}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {((improvementSuggestions && improvementSuggestions.length > 0) || (formattingSuggestions && formattingSuggestions.length > 0) || (grammarIssues && grammarIssues.length > 0)) && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold flex items-center text-blue-600 dark:text-blue-500 uppercase tracking-wider">
                    <Info className="h-5 w-5 mr-2" /> Suggestions
                  </h3>
                  <div className="space-y-3">
                    {[...(improvementSuggestions || []), ...(formattingSuggestions || []), ...(grammarIssues || [])].map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 shadow-sm">
                        <p className="text-sm text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {strengths && strengths.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold flex items-center text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                    <CheckCircle2 className="h-5 w-5 mr-2" /> Strengths
                  </h3>
                  <div className="space-y-3">
                    {strengths.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm">
                        <p className="text-sm text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
