import { evaluateResume, ATSRuleResult } from "./ats-rules";

export function calculateATSScore(resumeText: string): ATSRuleResult {
  return evaluateResume(resumeText);
}

export type { ATSRuleResult };
