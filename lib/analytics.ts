import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import { calculateATSScore } from "./ats";
import { format } from "date-fns";

export interface AnalyticsData {
  kpis: {
    totalResumes: number;
    totalAnalyses: number;
    avgAtsScore: number;
    highestAtsScore: number;
    lowestAtsScore: number;
    avgJobMatchScore: number;
    lastAnalysisDate: string | null;
  };
  charts: {
    atsTrend: { date: string; score: number }[];
    resumeQuality: { name: string; value: number }[];
    rolesDistribution: { name: string; value: number }[];
    missingTechnicalSkills: { skill: string; count: number }[];
    missingKeywords: { keyword: string; count: number }[];
  };
  recentAnalyses: Prisma.AnalysisGetPayload<{ include: { resume: true } }>[];
}

export async function getDashboardAnalytics(): Promise<AnalyticsData> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch all analyses for the user
  const analyses = await prisma.analysis.findMany({
    where: { resume: { userId } },
    include: { resume: true },
    orderBy: { createdAt: 'asc' },
  });

  const totalAnalyses = analyses.length;

  if (totalAnalyses === 0) {
    return {
      kpis: {
        totalResumes: 0,
        totalAnalyses: 0,
        avgAtsScore: 0,
        highestAtsScore: 0,
        lowestAtsScore: 0,
        avgJobMatchScore: 0,
        lastAnalysisDate: null,
      },
      charts: {
        atsTrend: [],
        resumeQuality: [],
        rolesDistribution: [],
        missingTechnicalSkills: [],
        missingKeywords: [],
      },
      recentAnalyses: [],
    };
  }

  // Unique resumes
  const uniqueResumeIds = new Set(analyses.map(a => a.resumeId));
  const totalResumes = uniqueResumeIds.size;

  let totalAts = 0;
  let highestAts = 0;
  let lowestAts = 100;
  let totalJobMatch = 0;
  let jobMatchCount = 0;

  const qualityCounts = {
    Excellent: 0,
    Good: 0,
    Average: 0,
    NeedsImprovement: 0,
  };

  const trendMap = new Map<string, { total: number; count: number }>();
  const roleFreq = new Map<string, number>();
  const techSkillFreq = new Map<string, number>();
  const keywordFreq = new Map<string, number>();

  for (const analysis of analyses) {
    const score = analysis.atsScore;
    totalAts += score;
    if (score > highestAts) highestAts = score;
    if (score < lowestAts) lowestAts = score;

    if (analysis.jobMatchScore !== null) {
      totalJobMatch += analysis.jobMatchScore;
      jobMatchCount++;
    }

    // Quality Distribution
    if (score >= 90) qualityCounts.Excellent++;
    else if (score >= 75) qualityCounts.Good++;
    else if (score >= 60) qualityCounts.Average++;
    else qualityCounts.NeedsImprovement++;

    // Trend
    const dateStr = format(analysis.createdAt, "MMM dd");
    const existingDate = trendMap.get(dateStr) || { total: 0, count: 0 };
    trendMap.set(dateStr, {
      total: existingDate.total + score,
      count: existingDate.count + 1,
    });

    // Parse JSON fields safely
    const safeArray = (val: unknown) => (Array.isArray(val) ? val : []);
    
    const roles = safeArray(analysis.recommendedJobRoles);
    roles.forEach(role => {
      roleFreq.set(role, (roleFreq.get(role) || 0) + 1);
    });

    const techSkills = safeArray(analysis.missingTechnicalSkills);
    techSkills.forEach(skill => {
      techSkillFreq.set(skill, (techSkillFreq.get(skill) || 0) + 1);
    });

    // Reconstruct ATS breakdown to get missing keywords since they aren't stored
    const atsResult = calculateATSScore(analysis.resume.parsedText);
    atsResult.missingKeywords.forEach(kw => {
      keywordFreq.set(kw, (keywordFreq.get(kw) || 0) + 1);
    });
  }

  const avgAtsScore = Math.round(totalAts / totalAnalyses);
  const avgJobMatchScore = jobMatchCount > 0 ? Math.round(totalJobMatch / jobMatchCount) : 0;
  const lastAnalysisDate = format(analyses[analyses.length - 1].createdAt, "MMM do, yyyy");

  // Format Chart Data
  const atsTrend = Array.from(trendMap.entries()).map(([date, data]) => ({
    date,
    score: Math.round(data.total / data.count),
  }));

  const resumeQuality = [
    { name: "Excellent (90-100)", value: qualityCounts.Excellent },
    { name: "Good (75-89)", value: qualityCounts.Good },
    { name: "Average (60-74)", value: qualityCounts.Average },
    { name: "Needs Improvement (<60)", value: qualityCounts.NeedsImprovement },
  ].filter(q => q.value > 0);

  const rolesDistribution = Array.from(roleFreq.entries())
    .map(([name, value]) => {
      // Shorten long role names
      const shortName = name.length > 20 ? name.substring(0, 18) + "..." : name;
      return { name: shortName, value };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const missingTechnicalSkills = Array.from(techSkillFreq.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const missingKeywords = Array.from(keywordFreq.entries())
    // Remove meaningless keywords (e.g., if frequency is too low or just noise)
    // We can filter out counts < 2 if there are many analyses, or just rely on sorting
    .filter(([, count]) => totalAnalyses <= 2 || count > 1) 
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const recentAnalyses = analyses
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    kpis: {
      totalResumes,
      totalAnalyses,
      avgAtsScore,
      highestAtsScore: highestAts === 100 && totalAnalyses === 0 ? 0 : highestAts,
      lowestAtsScore: lowestAts === 100 && totalAnalyses === 0 ? 0 : lowestAts,
      avgJobMatchScore,
      lastAnalysisDate,
    },
    charts: {
      atsTrend,
      resumeQuality,
      rolesDistribution,
      missingTechnicalSkills,
      missingKeywords,
    },
    recentAnalyses,
  };
}
