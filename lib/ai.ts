"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisSchema, AnalysisResult } from "./ai-schema";
import { calculateATSScore } from "./ats";

export async function analyzeResume(resumeText: string, jobDescription?: string): Promise<{ success: boolean; data?: AnalysisResult; error?: string }> {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY. Please restart the dev server if you just added it to .env.local.");
      return { success: false, error: "API key is missing on the server." };
    }

    const ai = new GoogleGenAI({ apiKey });

    if (!resumeText || resumeText.trim().length === 0) {
      return { success: false, error: "Empty resume text provided." };
    }

    const atsEngineResult = calculateATSScore(resumeText);

    const prompt = `You are an experienced ATS recruiter and senior software engineer.
Analyze this resume. DO NOT generate an ATS score, I have an engine for that.
${jobDescription ? "The user has provided a Job Description to match against. Please calculate a 'jobMatchScore' (0-100) and extract 'missingKeywords' based specifically on this JD." : ""}
Return ONLY valid JSON.

Schema:
{
  "overallRating": string,
  "summary": string,
  "strengths": [],
  "weaknesses": [],
  "missingTechnicalSkills": [],
  "missingSoftSkills": [],
  "grammarIssues": [],
  "formattingSuggestions": [],
  "improvementSuggestions": [],
  "recommendedJobRoles": []${jobDescription ? `,\n  "jobMatchScore": number,\n  "missingKeywords": []` : ""}
}

${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ""}
Resume:
${resumeText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRating: { type: Type.STRING },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingTechnicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSoftSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            grammarIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            formattingSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedJobRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
            ...(jobDescription && {
              jobMatchScore: { type: Type.INTEGER },
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            })
          },
          required: [
            "overallRating", "summary", "strengths", 
            "weaknesses", "missingTechnicalSkills", "missingSoftSkills", 
            "grammarIssues", "formattingSuggestions", "improvementSuggestions", 
            "recommendedJobRoles",
            ...(jobDescription ? ["jobMatchScore", "missingKeywords"] : [])
          ]
        }
      }
    });

    if (!response.text) {
      return { success: false, error: "Failed to generate analysis from AI." };
    }

    try {
      const parsedJson = JSON.parse(response.text);
      const geminiData = AnalysisSchema.parse(parsedJson);
      
      const finalData: AnalysisResult = {
        ...geminiData,
        atsScore: atsEngineResult.score,
        breakdown: atsEngineResult.breakdown,
        matchedKeywords: atsEngineResult.matchedKeywords,
        missingKeywords: atsEngineResult.missingKeywords,
        deductions: atsEngineResult.deductions,
        recommendations: atsEngineResult.recommendations
      };

      return { success: true, data: finalData };
    } catch (parseError) {
      console.error("JSON Parsing/Validation Error:", parseError);
      return { success: false, error: "AI returned invalid JSON data." };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { success: false, error: "Network or API failure during AI analysis." };
  }
}