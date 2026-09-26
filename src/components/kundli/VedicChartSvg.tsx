'use client';

import React from 'react';
import { ChartData } from '@/lib/astrology/types';
import { useLanguage } from '@/lib/i18n/context';

interface VedicChartSvgProps {
  chartData: ChartData;
  className?: string;
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

export default function VedicChartSvg({ chartData, className = '' }: VedicChartSvgProps) {
  const { language } = useLanguage();
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
    const pList = chartData.planets.filter((p) => p.house === h);
    return pList.map((p) => {
      if (language === 'hi') {
        const short = HINDI_PLANET_SHORT[p.name] || p.name.substring(0, 2);
        return p.isRetrograde ? `${short}(व)` : short;
      }
      const short = p.name.substring(0, 2);
      return p.isRetrograde ? `${short}(R)` : short;
    });
  };

  const houseCoordinates: Record<number, { rashi: [number, number]; planets: [number, number] }> = {
    1: { rashi: [200, 160], planets: [200, 120] },
    2: { rashi: [140, 75], planets: [100, 50] },
    3: { rashi: [75, 140], planets: [50, 100] },
    4: { rashi: [160, 200], planets: [120, 200] },
    5: { rashi: [75, 260], planets: [50, 300] },
    6: { rashi: [140, 325], planets: [100, 350] },
    7: { rashi: [200, 240], planets: [200, 280] },
    8: { rashi: [260, 325], planets: [300, 350] },
    9: { rashi: [325, 260], planets: [350, 300] },
    10: { rashi: [240, 200], planets: [280, 200] },
    11: { rashi: [325, 140], planets: [350, 100] },
    12: { rashi: [260, 75], planets: [300, 50] },
  };

  return (
    <div
      className={`w-full max-w-md mx-auto aspect-square p-2 bg-navy-900/90 border border-gold-500/40 rounded-2xl shadow-gold-glow backdrop-blur-md print:bg-white print:border-2 print:border-amber-900/60 print:shadow-none print:aspect-auto print:w-[300px] print:h-[300px] print:p-2 print:mx-auto print:block print:break-inside-avoid ${className}`}
    >
      <div className="text-center mb-1">
        <span className="text-[11px] font-semibold tracking-wider text-gold-400 uppercase font-heading print:text-amber-950 print:font-bold print:text-[10px]">
          {language === 'hi' ? 'लग्न कुंडली (उत्तर भारतीय वैदिक चक्र)' : 'Lagna Kundli (North Indian Vedic Chart)'}
        </span>
      </div>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full text-gold-400 print:text-amber-900 print:w-[280px] print:h-[260px] print:mx-auto print:block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Square */}
        <rect
          x="10"
          y="10"
          width="380"
          height="380"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-gold-500/80 print:stroke-amber-950 print:stroke-[2.5]"
        />

        {/* Main Corner Diagonals */}
        <line x1="10" y1="10" x2="390" y2="390" stroke="currentColor" strokeWidth="2" className="text-gold-500/60 print:stroke-amber-900/80 print:stroke-[1.5]" />
        <line x1="10" y1="390" x2="390" y2="10" stroke="currentColor" strokeWidth="2" className="text-gold-500/60 print:stroke-amber-900/80 print:stroke-[1.5]" />

        {/* Inner Diamond */}
        <polygon
          points="200,10 390,200 200,390 10,200"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gold-500/70 print:stroke-amber-900/80 print:stroke-[1.5]"
          fill="rgba(229, 184, 66, 0.03)"
        />

        {/* Rashi Numbers and Planets for each of 12 Houses */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
          const coords = houseCoordinates[houseNum];
          const rashi = getHouseSign(houseNum);
          const formattedRashi = formatRashiNumber(rashi);
          const planets = getHousePlanets(houseNum);

          return (
            <g key={houseNum}>
              <text
                x={coords.rashi[0]}
                y={coords.rashi[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={language === 'hi' ? '14' : '12'}
                fontWeight="bold"
                className="fill-gold-300 select-none opacity-80 print:fill-amber-950 print:opacity-100 print:font-black"
              >
                {formattedRashi}
              </text>

              {planets.length > 0 && (
                <text
                  x={coords.planets[0]}
                  y={coords.planets[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={language === 'hi' ? '11' : '10'}
                  fontWeight="600"
                  className="fill-white select-none print:fill-black print:font-black"
                >
                  {planets.join(' ')}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {chartData.isMockData && (
        <div className="text-center mt-1 print:hidden">
          <span className="text-[9px] text-gray-400">
            {language === 'hi'
              ? '* विकास / डेमो मोड: वैदिक खगोलीय ग्रह गणना'
              : '* Development Mode: Vedic Algorithmic Planetary Computation'}
          </span>
        </div>
      )}
    </div>
  );
}
