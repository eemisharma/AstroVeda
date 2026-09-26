export const ASTROLOGY_ETHICAL_SYSTEM_PROMPT = `
You are a master Vedic astrologer and thoughtful personal counselor providing dignified, grounded, and empowering life insights.

CRITICAL ETHICAL RULES (MUST ADHERE WITHOUT EXCEPTION):
1. Use ONLY the supplied birth chart and planetary calculations. Do not invent celestial positions.
2. Avoid guaranteed predictions (e.g. NEVER say "You will become a millionaire in 2028" or "You are guaranteed to get divorced").
3. Avoid fear-based statements, curses, dosha scaremongering, or ominous warnings.
4. Avoid claiming supernatural certainty. Frame observations as psychological tendencies, archetypal patterns, and timing opportunities.
5. Strictly avoid medical diagnosis or prescribing health cures.
6. Strictly avoid legal advice.
7. Avoid guaranteed financial outcomes.
8. Clearly communicate that astrology is a reflective tool for self-understanding and intentional living.
9. Deliver practical, respectful, and compassionate guidance tailored to modern professional and emotional life.

You must respond ONLY with valid JSON conforming to the requested schema.
`;

export function constructAnalysisPrompt(params: {
  customerName: string;
  serviceName: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  chartData: any;
}): string {
  return `
Analyze the following Vedic birth chart for ${params.customerName}:

Service Requested: ${params.serviceName}
Birth Date: ${params.birthDate}
Birth Time: ${params.birthTime}
Birth City: ${params.birthCity}

Calculated Chart Details:
- Ascendant (Lagna): ${params.chartData.ascendant.sign} at ${params.chartData.ascendant.degree}° (${params.chartData.ascendant.nakshatra})
- Moon Sign (Chandra Rashi): ${params.chartData.moonSign}
- Sun Sign (Surya Rashi): ${params.chartData.sunSign}
- Birth Nakshatra: ${params.chartData.nakshatra} (Pada ${params.chartData.nakshatraPada}, Lord: ${params.chartData.nakshatraLord})
- Current Mahadasha: ${params.chartData.dasha.currentMahadasha} - Antardasha: ${params.chartData.dasha.currentAntardasha}
- Planetary Placements:
${params.chartData.planets
  .map(
    (p: any) =>
      `  * ${p.name} in House ${p.house} (${p.sign}) at ${p.degree}° - Nakshatra: ${p.nakshatra}${
        p.isRetrograde ? ' (Retrograde)' : ''
      }`
  )
  .join('\n')}

Generate a comprehensive, deeply personalized Vedic analysis formatted as strict JSON:
{
  "summary": "High-level thematic overview of the birth chart and primary archetype",
  "personality": "In-depth breakdown of inner emotional drives, intellectual style, and temperament based on Ascendant, Moon, and Sun",
  "career": "Actionable career directions, leadership capabilities, work environment preferences, and favorable industries",
  "finance": "Wealth accumulation tendencies, relationship with risk and savings, and financial stability patterns",
  "relationships": "Relational dynamics, emotional compatibility tendencies, 7th house and Venus influences, and constructive communication advice",
  "strengths": ["Array of 4-6 distinct core strengths derived from favorable planetary alignments"],
  "challenges": ["Array of 3-5 growth areas or shadow tendencies to be mindful of without fatalism"],
  "recommendations": ["Array of 4-6 practical, uplifting, and actionable self-improvement habits or practices"],
  "important_periods": ["Array of 3-4 notable timing windows indicated by the current dasha and upcoming planetary shifts"]
}
`;
}
