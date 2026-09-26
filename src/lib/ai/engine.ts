import { AstrologyReportContent } from './types';
import { ASTROLOGY_ETHICAL_SYSTEM_PROMPT, constructAnalysisPrompt } from './prompt';
import { ChartData } from '../astrology/types';
import { generateHindiReportContent } from './hindi-report';

export class AIAnalysisService {
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY;
  }

  async generateReport(params: {
    customerName: string;
    serviceName: string;
    birthDate: string;
    birthTime: string;
    birthCity: string;
    chartData: ChartData;
  }): Promise<AstrologyReportContent> {
    if (this.apiKey && this.apiKey.trim() !== '') {
      try {
        const liveReport = await this.callGeminiAPI(params);
        if (liveReport) return liveReport;
      } catch (err) {
        console.warn('Live Gemini API call failed or timed out, using fallback interpretation engine:', err);
      }
    }

    return this.generateDeterministicReport(params);
  }

  private async callGeminiAPI(params: {
    customerName: string;
    serviceName: string;
    birthDate: string;
    birthTime: string;
    birthCity: string;
    chartData: ChartData;
  }): Promise<AstrologyReportContent | null> {
    const prompt = constructAnalysisPrompt(params);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${ASTROLOGY_ETHICAL_SYSTEM_PROMPT}\n\n${prompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    return {
      summary: parsed.summary || 'A powerful astrological profile of resilience and insight.',
      personality: parsed.personality || '',
      career: parsed.career || '',
      finance: parsed.finance || '',
      relationships: parsed.relationships || '',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      important_periods: Array.isArray(parsed.important_periods) ? parsed.important_periods : [],
      disclaimer:
        'This consultation report is generated for personal guidance, self-reflection, and psychological awareness. Astrology provides insights into tendencies and archetypal patterns; your conscious choices, character, and actions shape your destiny.',
      engineUsed: 'Gemini 1.5 Pro/Flash Vedic Synthesis',
      generatedAt: new Date().toISOString(),
    };
  }

  private generateDeterministicReport(params: {
    customerName: string;
    serviceName: string;
    birthDate: string;
    birthTime: string;
    birthCity: string;
    chartData: ChartData;
  }): AstrologyReportContent {
    const { customerName, serviceName, chartData } = params;
    const asc = chartData.ascendant.sign;
    const moon = chartData.moonSign;
    const sun = chartData.sunSign;
    const nak = chartData.nakshatra;
    const dasha = chartData.dasha.currentMahadasha;

    // Rich synthesis tailored to Vedic positions
    const summary = `Welcome ${customerName}. Your astrological blueprint reveals a distinctive balance of intentional intellect and deep emotional perception. With your Ascendant in ${asc} and your Moon residing in ${moon}, you naturally approach life with discerning vision and a high standard of personal authenticity. Your birth under the ${nak} Nakshatra confers an instinctive capacity to navigate complexities with grace. You are currently navigating the ${dasha} Mahadasha cycle, a period characterized by consolidation of personal authority and refined priority-setting.`;

    const personality = `Your Ascendant in ${asc} shapes the way you engage with your environment—projecting poise, deliberate judgment, and natural leadership. Beneath this external persona, your Moon in ${moon} governs your inner emotional processing. You possess a reflective and perceptive nature, preferring genuine depth over superficial social interactions. Sun in ${sun} supplies steady internal vitality, prompting you to seek recognition through tangible competence and integrity. When under pressure, you tend to internalize tension; developing mindfulness and intentional breathing routines helps balance your natural drive.`;

    const career = `Astrological indicators for your professional sphere highlight strong aptitude for strategic planning, systems thinking, and autonomous execution. Your 10th house dynamics suggest that you thrive best in environments where your domain expertise is trusted without micromanagement. Roles involving advisory capacities, analytical problem-solving, innovative technology, or sustainable commerce are exceptionally well-aligned. During this ${dasha} period, focus on building long-term institutional value rather than chasing speculative short-term pivots. Networking with established mentors will yield valuable collaborative dividends.`;

    const finance = `Your 2nd and 11th house signatures indicate disciplined earning potential with progressive accumulation over time. You possess an instinct for prudent resource allocation and are generally risk-conscious. Wealth creation is favored through diversified, asset-backed instruments and continuous investment in your professional skills. Be mindful of sudden emotional expenditures during intense transit periods; creating an automated monthly allocation strategy guarantees stability and peace of mind.`;

    const relationships = `In relational dynamics, your chart emphasizes emotional loyalty, mutual intellectual respect, and healthy boundaries. You value a partner who understands your desire for purposeful endeavor while providing a peaceful sanctuary from public demands. Venusian and 7th house influences suggest that clear, candid verbal expression prevents minor misunderstandings from festering. When you allow yourself to be vulnerable rather than overly self-reliant, your partnerships deepen substantially.`;

    const strengths = [
      `Strategic Discernment: Natural ability to analyze complex situations objectively and see through ambiguities (${asc} Lagna influence).`,
      `Resilient Inner Focus: Emotional grounding and perseverance during periods of external turbulence (${moon} Moon placement).`,
      `Intuitive Foresight: Perceptive instincts and adaptability fostered by your ${nak} Nakshatra.`,
      `Commitment to Excellence: High integrity, diligent craftsmanship, and an aversion to superficial compromise.`,
      `Mentorship Potential: Innate ability to guide others and establish structured pathways to shared success.`,
    ];

    const challenges = [
      `Perfectionistic Pressure: Tendency to hold yourself and colleagues to excessively rigorous standards, leading to mental fatigue.`,
      `Reserved Communication: Inclination to process emotional grievances privately rather than communicating expectations early.`,
      `Overthinking Strategic Pivots: Analysis paralysis when facing ambiguous or non-linear life choices.`,
      `Work-Rest Disconnect: Neglecting restorative pauses and physical relaxation during demanding career cycles.`,
    ];

    const recommendations = [
      `Cultivate a Daily Grounding Practice: Dedicate 15 minutes each morning to uninterrupted meditation, journaling, or pranayama.`,
      `Practice Expressive Vulnerability: Share your thought process and emotions transparently with trusted loved ones before decisions finalize.`,
      `Establish Clear Digital Boundaries: Unplug from work communications after sunset to restore your mental vitality.`,
      `Periodic Financial Review: Review asset allocation quarterly with a trusted financial planner to capitalize on steady compounding.`,
      `Express Gratitude Consciously: Keep a weekly record of milestones and relationships that support your journey.`,
    ];

    const currentYear = new Date().getFullYear();
    const important_periods = [
      `Mid ${currentYear} – Consolidation & Focus: Planetary transitions support deep professional upskilling and restructuring long-term commitments.`,
      `Late ${currentYear} / Early ${currentYear + 1} – Collaborative Expansion: Favorable planetary aspects unlock new relational and professional alliances.`,
      `${currentYear + 1} – Material & Intellectual Milestone: Harmonious alignment under ${dasha} Mahadasha for establishing long-term wealth assets.`,
      `${currentYear + 2} – Creative & Spiritual Renewal: A revitalizing cycle for personal creative expression, travel, and purposeful introspection.`,
    ];

    const hiReport = generateHindiReportContent({
      customerName,
      serviceName,
      chartData,
    });

    return {
      summary,
      personality,
      career,
      finance,
      relationships,
      strengths,
      challenges,
      recommendations,
      important_periods,
      disclaimer:
        'This consultation report is generated for personal guidance, self-reflection, and psychological awareness. Astrology provides insights into tendencies and archetypal patterns; your conscious choices, character, and actions shape your destiny.',
      engineUsed: 'Deterministic Vedic Astrological Synthesis Engine (Demo Mode)',
      generatedAt: new Date().toISOString(),
      hi: hiReport,
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();
