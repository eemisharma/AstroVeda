'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Compass,
  Star,
  ArrowRight,
  Sun,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { getDailyHoroscope, DailyHoroscopeResponse, DailyRashifalData } from '@/lib/astrology/daily-rashifal';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function DailyRashifalPreview() {
  const { language } = useLanguage();
  const [data, setData] = useState<DailyHoroscopeResponse | null>(null);
  const [selectedRashiId, setSelectedRashiId] = useState<string>('aries');

  useEffect(() => {
    const res = getDailyHoroscope(new Date());
    setData(res);
  }, []);

  const currentRashi: DailyRashifalData | undefined =
    data?.rashifals.find((r) => r.id === selectedRashiId) || data?.rashifals[0];

  return (
    <section className="py-16 bg-navy-900/60 border-b border-navy-800/80 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{language === 'hi' ? 'दैनिक राशिफल • 100% निःशुल्क' : 'Daily Horoscope • 100% Free'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            {language === 'hi' ? 'आज का राशिफल' : "Today's Rashifal"}
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            {language === 'hi'
              ? 'प्रत्येक दिन प्रातःकाल अपडेट होने वाला सभी 12 राशियों का वैदिक ग्रह गोचर फल। अपनी राशि चुनें और आज का दिन शुभ बनाएं।'
              : 'Authentic daily Vedic planetary transit forecasts for all 12 signs, updated fresh every single day.'}
          </p>

          {data && (
            <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-gray-300">
              <span className="flex items-center gap-1.5 text-gold-300 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                {language === 'hi' ? data.dateFormattedHi : data.dateFormattedEn}
              </span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                {language === 'hi' ? data.moonTransitHi : data.moonTransitEn}
              </span>
            </div>
          )}
        </ScrollReveal>

        {/* 12 Rashi Pills Selector */}
        {data && (
          <ScrollReveal direction="up" delay={100}>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
              {data.rashifals.map((r) => {
                const isSelected = r.id === selectedRashiId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRashiId(r.id)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-gold-500/20 to-amber-500/30 border-gold-400 text-white shadow-gold-glow scale-105'
                        : 'bg-navy-950/80 border-navy-800 text-gray-400 hover:text-gray-200 hover:bg-navy-850'
                    }`}
                  >
                    <span className="text-base">{r.symbol}</span>
                    <span className="text-xs font-bold font-heading">
                      {language === 'hi' ? r.nameHi : r.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        )}

        {/* Selected Rashi Highlight Card */}
        {currentRashi && (
          <ScrollReveal direction="up" delay={200}>
            <div className="bg-navy-950/90 border border-gold-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-gold-glow relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-navy-950 font-black text-2xl shadow-gold-glow shrink-0">
                    {currentRashi.symbol}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-heading">
                      {language === 'hi' ? currentRashi.sanskritName : `${currentRashi.nameEn} Daily Horoscope`}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {language === 'hi'
                        ? `स्वामी: ${currentRashi.lordHi} • ${currentRashi.element}`
                        : `Ruler: ${currentRashi.lordEn} • ${currentRashi.element}`}
                    </p>
                  </div>
                </div>

                {/* Rating & Lucky numbers */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-navy-900 px-3 py-1.5 rounded-xl border border-navy-800">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < currentRashi.rating ? 'text-gold-400 fill-gold-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-gold-300 font-mono font-bold">
                      {language === 'hi' ? 'अंक:' : 'No:'} {currentRashi.luckyNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-white font-semibold">
                      {language === 'hi' ? currentRashi.luckyColorHi : currentRashi.luckyColorEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Forecast Snippet */}
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {language === 'hi' ? currentRashi.overviewHi : currentRashi.overviewEn}
              </p>

              {/* Remedy */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gold-300 font-semibold mb-0.5">
                    {language === 'hi' ? 'आज का वैदिक उपाय:' : "Today's Sacred Remedy:"}
                  </strong>
                  <span>{language === 'hi' ? currentRashi.dailyRemedyHi : currentRashi.dailyRemedyEn}</span>
                </div>
              </div>

              {/* Footer Links: Full Rashifal & Chat Live */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
                <Link
                  href="/daily-rashifal"
                  className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <span>{language === 'hi' ? 'सभी 12 राशियों का विस्तृत राशिफल देखें' : 'View Full Horoscope for All 12 Signs'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/consultation/ai-chat"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'Chat Live शुरू करें (₹99)' : 'Start Chat Live (₹99)'}</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
