"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import { AnalysisResult } from "./ai-schema";
import { CURRENT_AI_MODEL } from "./constants";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function saveAnalysis(
  resumeText: string,
  fileName: string,
  title: string,
  analysisData: AnalysisResult,
  jobDescription?: string,
  fingerprint?: string,
  forceReanalyze?: boolean
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // If forceReanalyze is true and we have a fingerprint, check if it exists and delete it first
  if (forceReanalyze && fingerprint) {
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { fingerprint },
      include: { resume: true }
    });
    
    if (existingAnalysis && existingAnalysis.resume.userId === userId) {
      // Delete the old resume, which will cascade delete the old analysis
      await prisma.resume.delete({
        where: { id: existingAnalysis.resume.id }
      });
    }
  }

  // 1. Create the Resume record
  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      fileName,
      parsedText: resumeText,
    },
  });

  // 2. Create the Analysis record
  // We extract the properties to match the schema
  const analysis = await prisma.analysis.create({
    data: {
      resumeId: resume.id,
      atsScore: analysisData.atsScore,
      overallRating: analysisData.overallRating,
      summary: analysisData.summary,
      strengths: analysisData.strengths || [],
      weaknesses: analysisData.weaknesses || [],
      missingTechnicalSkills: analysisData.missingTechnicalSkills || [],
      missingSoftSkills: analysisData.missingSoftSkills || [],
      grammarIssues: analysisData.grammarIssues || [],
      formattingSuggestions: analysisData.formattingSuggestions || [],
      improvementSuggestions: analysisData.improvementSuggestions || [],
      recommendedJobRoles: analysisData.recommendedJobRoles || [],
      jobDescription: jobDescription || null,
      jobMatchScore: analysisData.jobMatchScore || null,
      fingerprint: fingerprint || null,
    },
  });

  revalidatePath("/dashboard/history");
  
  return analysis.id;
}

function normalizeText(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ");
}

export async function checkCache(resumeText: string, jobDescription?: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const normalizedResume = normalizeText(resumeText);
  const normalizedJD = jobDescription ? normalizeText(jobDescription) : "";

  const hashContent = `${userId}|${normalizedResume}|${normalizedJD}|${CURRENT_AI_MODEL}`;
  const fingerprint = crypto.createHash("sha256").update(hashContent).digest("hex");

  const existingAnalysis = await prisma.analysis.findUnique({
    where: { fingerprint }
  });

  if (existingAnalysis) {
    const resume = await prisma.resume.findUnique({ where: { id: existingAnalysis.resumeId } });
    if (resume && resume.userId === userId) {
      return { analysisId: existingAnalysis.id, fingerprint };
    }
  }

  return { analysisId: null, fingerprint };
}

export async function getAnalysisById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: { resume: true },
  });

  if (!analysis) {
    return null;
  }

  // Ensure the user owns this analysis via the resume relation
  if (analysis.resume.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return analysis;
}

export async function getAnalysesHistory(
  search: string = "",
  filter: string = "All",
  sort: string = "Newest",
  page: number = 1,
  pageSize: number = 10
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Build Where Clause
  const where: Prisma.AnalysisWhereInput = {
    resume: {
      userId,
      ...(search ? {
        OR: [
          { fileName: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
        ],
      } : {}),
    },
  };

  if (filter === "Excellent") where.atsScore = { gte: 90 };
  else if (filter === "Good") where.atsScore = { gte: 75, lt: 90 };
  else if (filter === "Average") where.atsScore = { gte: 60, lt: 75 };
  else if (filter === "Needs Improvement") where.atsScore = { lt: 60 };

  // Build OrderBy Clause
  let orderBy: Prisma.AnalysisOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "Oldest") orderBy = { createdAt: "asc" };
  else if (sort === "Highest ATS") orderBy = { atsScore: "desc" };
  else if (sort === "Lowest ATS") orderBy = { atsScore: "asc" };
  else if (sort === "Highest Job Match") orderBy = { jobMatchScore: "desc" };

  const [analyses, totalCount] = await Promise.all([
    prisma.analysis.findMany({
      where,
      include: { resume: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.analysis.count({ where }),
  ]);

  return { analyses, totalCount };
}

export async function deleteAnalysis(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find the analysis to ensure ownership
  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: { resume: true },
  });

  if (!analysis) {
    throw new Error("Not found");
  }

  if (analysis.resume.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Delete the resume (which cascades to analysis)
  await prisma.resume.delete({
    where: { id: analysis.resume.id },
  });

  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard");
}

export async function deleteUserAccount() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1. Delete all resumes associated with this user (cascades to analyses)
  await prisma.resume.deleteMany({
    where: { userId },
  });

  // 2. Delete the user from Clerk
  const client = await clerkClient();
  await client.users.deleteUser(userId);

  return { success: true };
}
