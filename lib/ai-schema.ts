import { z } from "zod";

export const AnalysisSchema = z.object({
  overallRating: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingTechnicalSkills: z.array(z.string()),
  missingSoftSkills: z.array(z.string()),
  grammarIssues: z.array(z.string()),
  formattingSuggestions: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
  recommendedJobRoles: z.array(z.string()).optional(),
  
  // Job Description Matching
  jobMatchScore: z.number().optional(),
  missingKeywords: z.array(z.string()).optional(),
});

export type GeminiAnalysis = z.infer<typeof AnalysisSchema>;

export interface AnalysisResult extends GeminiAnalysis {
  atsScore: number;
  breakdown: {
    contact: number;
    summary: number;
    education: number;
    skills: number;
    projects: number;
    experience: number;
    certifications: number;
    keywords: number;
    formatting: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  deductions: string[];
  recommendations: string[];
}
