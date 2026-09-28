'use client';

import React, { useState } from 'react';
import { ChartData } from '@/lib/astrology/types';
import { useLanguage } from '@/lib/i18n/context';
import { Sparkles, Info } from 'lucide-react';

interface VedicChartSvgProps {
  chartData: ChartData;
  className?: string;
  showTable?: boolean;
}

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९', '१०', '११', '१२'];

const HINDI_PLANET_SHORT: Record<string, string> = {
  Sun: 'सू',
  Moon: 'चं',
  Mars: 'मं',
  Mercury: 'बु',
  Jupiter: 'गु',
  Venus: 'शु',
  Saturn: 'श',
  Rahu: 'रा',
  Ketu: 'के',
};

const PLANET_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Sun: { bg: 'fill-amber-500/20', text: 'fill-amber-300', dot: '#f59e0b' },
  Moon: { bg: 'fill-indigo-300/20', text: 'fill-indigo-100', dot: '#e0e7ff' },
  Mars: { bg: 'fill-red-500/20', text: 'fill-red-400', dot: '#ef4444' },
  Mercury: { bg: 'fill-emerald-500/20', text: 'fill-emerald-300', dot: '#10b981' },
  Jupiter: { bg: 'fill-yellow-500/20', text: 'fill-yellow-300', dot: '#eab308' },
  Venus: { bg: 'fill-pink-400/20', text: 'fill-pink-200', dot: '#f472b6' },
  Saturn: { bg: 'fill-blue-500/20', text: 'fill-blue-300', dot: '#3b82f6' },
  Rahu: { bg: 'fill-purple-500/20', text: 'fill-purple-300', dot: '#a855f7' },
  Ketu: { bg: 'fill-amber-700/20', text: 'fill-amber-400', dot: '#b45309' },
};

const HOUSE_METADATA: Record<number, { nameHi: string; nameEn: string; karakaHi: string; karakaEn: string; typeHi: string; typeEn: string }> = {
  1: { nameHi: 'तनु भाव (लग्न)', nameEn: '1st House (Lagna)', karakaHi: 'शरीर, रूप, स्वास्थ्य, आत्मबल', karakaEn: 'Self, Physical Body, Vitality', typeHi: 'केंद्र व त्रिकोण', typeEn: 'Kendra & Trikona' },
  2: { nameHi: 'धन भाव', nameEn: '2nd House (Dhana)', karakaHi: 'धन संचय, वाणी, कुटुंब, प्रारंभिक शिक्षा', karakaEn: 'Wealth, Speech, Family Assets', typeHi: 'मारक भाव', typeEn: 'Maraka House' },
  3: { nameHi: 'सहज भाव (पराक्रम)', nameEn: '3rd House (Sahaja)', karakaHi: 'साहस, छोटे भाई-बहन, लघु यात्राएं, संप्रेषण', karakaEn: 'Courage, Siblings, Short Travel', typeHi: 'उपचय भाव', typeEn: 'Upachaya House' },
  4: { nameHi: 'सुख भाव (मातृ भाव)', nameEn: '4th House (Sukha)', karakaHi: 'माता, भूमि, भवन, वाहन, मानसिक शांति', karakaEn: 'Mother, Home, Vehicles, Inner Peace', typeHi: 'केंद्र भाव', typeEn: 'Kendra House' },
  5: { nameHi: 'पुत्र भाव (विद्या)', nameEn: '5th House (Putra)', karakaHi: 'संतान, उच्च बुद्धि, पूर्व जन्म पुण्य, प्रेम', karakaEn: 'Children, Intellect, Past Karma, Romance', typeHi: 'त्रिकोण भाव (अत्यंत शुभ)', typeEn: 'Trikona House' },
  6: { nameHi: 'रिपु भाव (रोग व ऋण)', nameEn: '6th House (Ari/Ripu)', karakaHi: 'शत्रु, रोग, ऋण, प्रतियोगिता, सेवा भाव', karakaEn: 'Enemies, Health Debts, Competitions', typeHi: 'त्रिक भाव / उपचय', typeEn: 'Dusthana / Upachaya' },
  7: { nameHi: 'जाया भाव (विवाह)', nameEn: '7th House (Kalatra)', karakaHi: 'जीवनसाथी, विवाह, साझेदारी, सार्वजनिक छवि', karakaEn: 'Spouse, Marriage, Business Partnerships', typeHi: 'केंद्र व मारक', typeEn: 'Kendra & Maraka' },
  8: { nameHi: 'आयु भाव (रन्ध्र भाव)', nameEn: '8th House (Ayur)', karakaHi: 'दीर्घायु, गूढ़ विद्या, आकस्मिक धन, परिवर्तन', karakaEn: 'Longevity, Occult, Sudden Gains/Transformation', typeHi: 'त्रिक भाव', typeEn: 'Dusthana House' },
  9: { nameHi: 'धर्म भाव (भाग्य भाव)', nameEn: '9th House (Bhagya)', karakaHi: 'भाग्य, धर्म, पिता, गुरु, उच्च ज्ञान, तीर्थयात्रा', karakaEn: 'Fortune, Dharma, Father, Mentors, Pilgrimage', typeHi: 'त्रिकोण भाव (परम शुभ)', typeEn: 'Supreme Trikona' },
  10: { nameHi: 'कर्म भाव (राज्य भाव)', nameEn: '10th House (Karma)', karakaHi: 'करियर, प्रतिष्ठा, उच्च पद, आजीविका, शासन', karakaEn: 'Career, Fame, Authority, Leadership', typeHi: 'केंद्र भाव (कर्म स्थान)', typeEn: 'Supreme Kendra' },
  11: { nameHi: 'लाभ भाव (आय भाव)', nameEn: '11th House (Labha)', karakaHi: 'आय, समस्त मनोकामना पूर्ति, बड़े भाई-बहन', karakaEn: 'Gains, Income, Ambitions, Social Circle', typeHi: 'उपचय भाव', typeEn: 'Upachaya House' },
  12: { nameHi: 'व्यय भाव (मोक्ष भाव)', nameEn: '12th House (Vyaya)', karakaHi: 'मोक्ष, विदेश यात्रा, व्यय, दान, आध्यात्मिक एकांत', karakaEn: 'Moksha, Foreign Lands, Expenses, Seclusion', typeHi: 'त्रिक भाव', typeEn: 'Dusthana House' },
};

export default function VedicChartSvg({ chartData, className = '', showTable = true }: VedicChartSvgProps) {
  const { language } = useLanguage();
  const [activeHouse, setActiveHouse] = useState<number>(1);
  const ascSign = chartData.ascendant.signNumber || 1;

  const getHouseSign = (h: number) => {
    return ((ascSign + h - 2) % 12) + 1;
  };

  const formatRashiNumber = (rashiNum: number) => {
    if (language === 'hi') {
      return DEVANAGARI_DIGITS[rashiNum] || String(rashiNum);
    }
    return String(rashiNum);
  };

  const getHousePlanets = (h: number) => {
    return chartData.planets.filter((p) => p.house === h);
  };

  // SVG Coordinates for Rashi Number and Planets for each of 12 Houses
  const houseCenterCoordinates: Record<number, { rashi: [number, number]; planets: [number, number] }> = {
    1: { rashi: [200, 160], planets: [200, 115] },
    2: { rashi: [140, 75], planets: [100, 50] },
    3: { rashi: [75, 140], planets: [50, 100] },
    4: { rashi: [160, 200], planets: [115, 200] },
    5: { rashi: [75, 260], planets: [50, 300] },
    6: { rashi: [140, 325], planets: [100, 350] },
    7: { rashi: [200, 240], planets: [200, 285] },
    8: { rashi: [260, 325], planets: [300, 350] },
    9: { rashi: [325, 260], planets: [350, 300] },
    10: { rashi: [240, 200], planets: [285, 200] },
    11: { rashi: [325, 140], planets: [350, 100] },
    12: { rashi: [260, 75], planets: [300, 50] },
  };

  // Exact boundary polygon points for each of 12 Vedic North Indian houses
  const housePolygons: Record<number, string> = {
    1: '200,10 295,105 200,200 105,105',
    2: '10,10 200,10 105,105',
    3: '10,10 105,105 10,200',
    4: '10,200 105,105 200,200 105,295',
    5: '10,200 105,295 10,390',
    6: '10,390 105,295 200,390',
    7: '200,200 295,295 200,390 105,295',
    8: '200,390 295,295 390,390',
    9: '390,200 295,295 390,390',
    10: '200,200 295,105 390,200 295,295',
    11: '390,10 390,200 295,105',
    12: '200,10 390,10 295,105',
  };

  const activeMeta = HOUSE_METADATA[activeHouse];
  const activeSignNum = getHouseSign(activeHouse);
  const activeSignName = chartData.houses.find((h) => h.houseNumber === activeHouse)?.sign || `Rashi ${activeSignNum}`;
  const activePlanets = getHousePlanets(activeHouse);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Luxury Vedic Chart Frame */}
      <div className="w-full max-w-lg mx-auto bg-gradient-to-b from-navy-900/95 via-navy-950 to-navy-900/95 border-2 border-gold-500/50 rounded-3xl p-3 sm:p-5 shadow-gold-glow-lg backdrop-blur-md relative overflow-hidden print:bg-white print:border-2 print:border-amber-900/80 print:shadow-none print:w-[320px] print:h-[320px] print:p-2">
        {/* Subtle Cosmic Ambient Glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-gold-300 uppercase font-heading">
              {language === 'hi' ? 'वैदिक लग्न चक्र (उत्तर भारतीय पद्धति)' : 'Vedic Lagna Kundli (North Indian)'}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
            {language === 'hi' ? 'भाव पर क्लिक कर विवरण देखें' : 'Click house to inspect'}
          </span>
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative aspect-square w-full">
          <svg
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full text-gold-400 print:text-amber-950"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Outer Glow Filter */}
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Rotating Sacred Sri Yantra / Cosmic Chakra Rings (Screen Only) */}
            <g className="opacity-15 print:hidden origin-center animate-spin-slow">
              <circle cx="200" cy="200" r="140" stroke="#e5b842" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="110" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 4" />
              <circle cx="200" cy="200" r="80" stroke="#e5b842" strokeWidth="0.6" strokeDasharray="2 4" />
              {/* 12 Solar Spokes */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 200 + 40 * Math.cos(angle);
                const y1 = 200 + 40 * Math.sin(angle);
                const x2 = 200 + 140 * Math.cos(angle);
                const y2 = 200 + 140 * Math.sin(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e5b842" strokeWidth="0.5" />;
              })}
            </g>

            {/* House Interactive Polygons (Hover & Active Glow) */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
              const isSelected = activeHouse === houseNum;
              return (
                <polygon
                  key={`poly-${houseNum}`}
                  points={housePolygons[houseNum]}
                  onClick={() => setActiveHouse(houseNum)}
                  className={`cursor-pointer transition-all duration-300 print:hidden ${
                    isSelected
                      ? 'fill-gold-500/25 stroke-gold-400 stroke-[2.5]'
                      : 'fill-transparent hover:fill-gold-500/10 stroke-transparent hover:stroke-gold-500/40'
                  }`}
                />
              );
            })}

            {/* Sacred Vedic Outer Square Borders */}
            <rect
              x="10"
              y="10"
              width="380"
              height="380"
              stroke="#e5b842"
              strokeWidth="2.5"
              className="text-gold-500 print:stroke-amber-950 print:stroke-[2.5]"
            />
            <rect
              x="14"
              y="14"
              width="372"
              height="372"
              stroke="#e5b842"
              strokeWidth="0.8"
              strokeOpacity="0.4"
              className="print:hidden"
            />

            {/* Corner Celestial Accents */}
            <circle cx="10" cy="10" r="3.5" fill="#f59e0b" className="print:hidden" />
            <circle cx="390" cy="10" r="3.5" fill="#f59e0b" className="print:hidden" />
            <circle cx="10" cy="390" r="3.5" fill="#f59e0b" className="print:hidden" />
            <circle cx="390" cy="390" r="3.5" fill="#f59e0b" className="print:hidden" />

            {/* Main Corner Diagonals */}
            <line x1="10" y1="10" x2="390" y2="390" stroke="#e5b842" strokeWidth="2" strokeOpacity="0.85" className="print:stroke-amber-900" />
            <line x1="10" y1="390" x2="390" y2="10" stroke="#e5b842" strokeWidth="2" strokeOpacity="0.85" className="print:stroke-amber-900" />

            {/* Inner Diamond (Rhombus) */}
            <polygon
              points="200,10 390,200 200,390 10,200"
              stroke="#e5b842"
              strokeWidth="2"
              strokeOpacity="0.9"
              fill="rgba(229, 184, 66, 0.02)"
              className="print:stroke-amber-900"
            />

            {/* Rashi Numbers and Planets for each of 12 Houses */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
              const coords = houseCenterCoordinates[houseNum];
              const rashi = getHouseSign(houseNum);
              const formattedRashi = formatRashiNumber(rashi);
              const planets = getHousePlanets(houseNum);
              const isSelected = activeHouse === houseNum;

              return (
                <g key={houseNum} onClick={() => setActiveHouse(houseNum)} className="cursor-pointer">
                  {/* Rashi Number in House */}
                  <text
                    x={coords.rashi[0]}
                    y={coords.rashi[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={language === 'hi' ? '15' : '13'}
                    fontWeight="bold"
                    className={`select-none transition-all duration-200 ${
                      isSelected
                        ? 'fill-gold-200 font-black scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                        : 'fill-gold-400/90 print:fill-amber-950 font-bold'
                    }`}
                  >
                    {formattedRashi}
                  </text>

                  {/* Occupying Planets */}
                  {planets.length > 0 && (
                    <g>
                      {planets.map((p, pIdx) => {
                        const count = planets.length;
                        // Layout multiple planets neatly around center
                        let offsetX = 0;
                        let offsetY = 0;
                        if (count === 2) {
                          offsetX = pIdx === 0 ? -16 : 16;
                        } else if (count >= 3) {
                          offsetX = ((pIdx % 3) - 1) * 20;
                          offsetY = pIdx >= 3 ? 14 : 0;
                        }

                        const pX = coords.planets[0] + offsetX;
                        const pY = coords.planets[1] + offsetY;
                        const colorInfo = PLANET_COLORS[p.name] || { text: 'fill-white', dot: '#fff' };

                        const short = language === 'hi'
                          ? HINDI_PLANET_SHORT[p.name] || p.name.substring(0, 2)
                          : p.name.substring(0, 2);
                        const label = p.isRetrograde ? `${short}(R)` : short;

                        return (
                          <g key={p.name} className="transition-transform hover:scale-110">
                            {/* Planetary Jewel Halo (Screen) */}
                            <circle
                              cx={pX}
                              cy={pY}
                              r="8"
                              fill={colorInfo.dot}
                              fillOpacity="0.18"
                              className="print:hidden"
                            />
                            <text
                              x={pX}
                              y={pY}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={language === 'hi' ? '10' : '9.5'}
                              fontWeight="bold"
                              className={`${colorInfo.text} select-none font-sans font-bold print:fill-black print:font-black`}
                            >
                              {label}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected House Interactive Inspection Banner */}
        <div className="mt-3 p-3.5 rounded-2xl bg-navy-950/90 border border-gold-500/30 text-xs space-y-1.5 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center text-xs border border-gold-500/30">
                {activeHouse}
              </span>
              <strong className="text-white font-heading text-sm">
                {language === 'hi' ? activeMeta.nameHi : activeMeta.nameEn}
              </strong>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-gold-400 font-medium">
                {activeSignName}
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {language === 'hi' ? activeMeta.typeHi : activeMeta.typeEn}
            </span>
          </div>

          <div className="text-[11px] text-gray-300 flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
            <span>
              <span className="text-gray-400">{language === 'hi' ? 'कारकत्व: ' : 'Significations: '}</span>
              {language === 'hi' ? activeMeta.karakaHi : activeMeta.karakaEn}
            </span>
          </div>

          <div className="text-[11px] pt-1 border-t border-navy-800 flex items-center justify-between">
            <span className="text-gray-400">
              {language === 'hi' ? 'उपस्थित ग्रह:' : 'Occupying Planets:'}
            </span>
            <span className="font-semibold text-gold-300">
              {activePlanets.length > 0
                ? activePlanets.map((p) => `${language === 'hi' ? p.sanskritName : p.name} (${p.degree}°)`).join(', ')
                : language === 'hi' ? 'कोई ग्रह नहीं (शुभ दृष्टि प्रभाव)' : 'No direct planet (Aspects active)'}
            </span>
          </div>
        </div>

        {/* Mathematical Accuracy Footer */}
        <div className="text-center mt-2 print:hidden">
          <span className="text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
            <Info className="w-3 h-3 text-gold-400" />
            {chartData.calculationNote || 'Calculated using Vedic Ephemeris with Lahiri Ayanamsha'}
          </span>
        </div>
      </div>

      {/* Planetary Position Detailed Table (Graha Sthiti) */}
      {showTable && chartData.planets && (
        <div className="w-full max-w-lg mx-auto bg-navy-900/80 border border-navy-800 rounded-2xl p-4 space-y-3 print:block print:break-inside-avoid">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 font-heading">
              {language === 'hi' ? 'ग्रह स्थिति एवं नक्षत्र विवरण (Planetary Degrees)' : 'Planetary Positions & Nakshatra'}
            </h4>
            <span className="text-[10px] text-gray-400 font-mono">
              {language === 'hi' ? 'लाहिड़ी अयनांश' : 'Lahiri Ayanamsha'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {chartData.planets.map((planet) => {
              const colorInfo = PLANET_COLORS[planet.name] || { dot: '#e5b842' };
              return (
                <div
                  key={planet.name}
                  className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-800/80 space-y-1 hover:border-gold-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: colorInfo.dot }} />
                      {language === 'hi' ? planet.sanskritName : planet.name}
                    </span>
                    {planet.isRetrograde && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1 rounded">
                        {language === 'hi' ? 'वक्री' : 'R'}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-300">
                    <span>{planet.sign}</span>
                    <span className="text-gold-300 font-mono ml-1">{planet.degree}°</span>
                  </div>
                  <div className="text-[9px] text-gray-400">
                    <span>{planet.nakshatra}</span>
                    <span className="text-gray-500 ml-1">पद {planet.pada}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
