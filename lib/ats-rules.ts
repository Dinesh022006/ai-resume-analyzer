import { allKeywords } from "./ats-keywords";

export interface ATSRuleResult {
  score: number;
  maxScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  deductions: string[];
  recommendations: string[];
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
}

export function evaluateResume(text: string): ATSRuleResult {
  const normalizedText = text.toLowerCase();
  
  const deductions: string[] = [];
  const recommendations: string[] = [];

  // 1. Contact Information (10 points)
  let contactScore = 0;
  // Basic email regex
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  if (hasEmail) contactScore += 3;
  
  // Phone regex (very permissive to catch formats like +1-234-567-8900, (123) 456-7890)
  const hasPhone = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(text);
  if (hasPhone) contactScore += 3;

  const hasLinkedIn = /linkedin\.com\/in\//i.test(text) || /\blinkedin\b/i.test(text);
  if (hasLinkedIn) contactScore += 2;

  const hasGitHub = /github\.com\//i.test(text) || /\bgithub\b/i.test(text);
  if (hasGitHub) contactScore += 2;

  // 2. Professional Summary (10 points)
  let summaryScore = 0;
  const hasSummary = /\b(summary|profile|about me|objective)\b/i.test(normalizedText.slice(0, 1000));
  if (hasSummary) {
    summaryScore += 10;
  } else {
    deductions.push("Missing professional summary section.");
    recommendations.push("Add a brief professional summary at the top of your resume.");
  }

  // 3. Education (10 points)
  let educationScore = 0;
  const hasEducation = /\b(education|academic background|degree)\b/i.test(normalizedText);
  if (hasEducation) {
    educationScore += 5;
    const hasDegree = /\b(bachelor|master|phd|b\.s|b\.a|m\.s|m\.a|degree)\b/i.test(normalizedText);
    const hasCollege = /\b(university|college|institute|technology)\b/i.test(normalizedText);
    if (hasDegree) educationScore += 3;
    if (hasCollege) educationScore += 2;
  } else {
    deductions.push("Missing Education section.");
  }

  // 4. Skills Section (15 points)
  let skillsScore = 0;
  const hasSkillsSection = /\b(skills|technologies|technical skills|core competencies)\b/i.test(normalizedText);
  if (hasSkillsSection) {
    skillsScore += 5;
  } else {
    deductions.push("Missing a dedicated Skills section.");
  }

  // 5. Projects (15 points)
  let projectsScore = 0;
  const hasProjects = /\b(projects|personal projects|academic projects|open source)\b/i.test(normalizedText);
  if (hasProjects) {
    projectsScore += 15;
  } else {
    deductions.push("Missing Projects section. Highlighting projects is crucial for technical roles.");
  }

  // 6. Experience (15 points)
  let experienceScore = 0;
  const hasExperience = /\b(experience|work history|employment|internship)\b/i.test(normalizedText);
  if (hasExperience) {
    experienceScore += 15;
  } else {
    deductions.push("Missing Experience section.");
    recommendations.push("Ensure your experience section is clearly labeled as 'Experience'.");
  }

  // 7. Certifications (5 points)
  let certificationsScore = 0;
  const hasCertifications = /\b(certifications|certificates|courses|awards)\b/i.test(normalizedText);
  if (hasCertifications) {
    certificationsScore += 5;
  } else {
    recommendations.push("Consider adding a Certifications section if you have relevant credentials.");
  }

  // 8. Keyword Coverage (10 points)
  let keywordsScore = 0;
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  
  allKeywords.forEach(kw => {
    if (normalizedText.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Calculate keyword score based on total matched. 
  // 10 matches = 10 points. Max 10 points.
  const uniqueMatched = Array.from(new Set(matchedKeywords));
  keywordsScore = Math.min(10, uniqueMatched.length);
  
  // Add to skills score if technical skills found
  if (uniqueMatched.length >= 5 && skillsScore < 15) {
    skillsScore = Math.min(15, skillsScore + 10);
  }

  // 9. Formatting (10 points)
  let formattingScore = 10;
  const wordsCount = normalizedText.split(/\s+/).length;
  
  if (wordsCount < 200) {
    formattingScore -= 5;
    deductions.push("Resume is too short (under 200 words).");
    recommendations.push("Add more detail to your experience and projects to hit ~400-600 words.");
  } else if (wordsCount > 1500) {
    formattingScore -= 3;
    deductions.push("Resume is excessively long (over 1500 words).");
    recommendations.push("Condense your resume to keep it concise and impactful.");
  }

  if (!hasEmail || !hasPhone) {
    formattingScore -= 3;
    deductions.push("Missing essential contact details (Email/Phone).");
  }
  
  formattingScore = Math.max(0, formattingScore);

  const totalScore = contactScore + summaryScore + educationScore + skillsScore + projectsScore + experienceScore + certificationsScore + keywordsScore + formattingScore;

  return {
    score: totalScore,
    maxScore: 100,
    matchedKeywords: uniqueMatched,
    missingKeywords,
    deductions,
    recommendations,
    breakdown: {
      contact: contactScore,
      summary: summaryScore,
      education: educationScore,
      skills: skillsScore,
      projects: projectsScore,
      experience: experienceScore,
      certifications: certificationsScore,
      keywords: keywordsScore,
      formatting: formattingScore
    }
  };
}
