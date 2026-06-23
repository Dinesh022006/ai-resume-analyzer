import { AnalysisResult } from "./ai-schema";

/**
 * Isolated utility for temporary storage of the analysis result.
 * This will be replaced by Prisma (database) in the next phase.
 */

let memoryStore: AnalysisResult | null = null;

export const AnalysisStore = {
  set: (data: AnalysisResult) => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("temp_analysis_result", JSON.stringify(data));
      } catch {
        console.error("Failed to save to sessionStorage");
      }
    } else {
      memoryStore = data;
    }
  },
  
  get: (): AnalysisResult | null => {
    if (typeof window !== "undefined") {
      try {
        const item = sessionStorage.getItem("temp_analysis_result");
        if (item) return JSON.parse(item) as AnalysisResult;
      } catch {
        console.error("Failed to read from sessionStorage");
      }
    }
    return memoryStore;
  },

  clear: () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("temp_analysis_result");
      } catch {}
    }
    memoryStore = null;
  }
};
