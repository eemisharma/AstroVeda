export interface AstrologyReportContent {
  summary: string;
  personality: string;
  career: string;
  finance: string;
  relationships: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  important_periods: string[];
  disclaimer: string;
  engineUsed: string;
  generatedAt: string;
  hi?: {
    summary: string;
    personality: string;
    career: string;
    finance: string;
    relationships: string;
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    important_periods: string[];
    disclaimer: string;
  };
}
