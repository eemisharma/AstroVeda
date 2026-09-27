'use client';

import { useState, useEffect } from 'react';
import { Users, Sparkles, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface LiveCosmicCountersProps {
  variant?: 'compact' | 'pill' | 'banner';
  className?: string;
}

export default function LiveCosmicCounters({
  variant = 'compact',
  className = '',
}: LiveCosmicCountersProps) {
  const { language } = useLanguage();

  // 1. Live Visitors: Fluctuates low to high, high to low, never stops (oscillates around 210–380)
  const [liveVisitors, setLiveVisitors] = useState(254);

  // 2. Today's Cumulative Visitors: steadily increments (+1 occasionally)
  const [todayVisitors, setTodayVisitors] = useState(14832);

  // 3. Rashi / Kundli Checked Count: increases every few random seconds
  const [rashiChecked, setRashiChecked] = useState(6428);

  useEffect(() => {
    // Live visitor continuous fluctuation (low to high, high to low)
    const liveInterval = setInterval(() => {
      setLiveVisitors((prev) => {
        // Delta between -4 and +5 with gentle bias to stay within realistic bounds
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        let next = prev + delta;
        if (next < 175) next += 8;
        if (next > 410) next -= 9;
        return next;
      });
    }, 2800);

    // Today's visitors slow increment
    const todayInterval = setInterval(() => {
      setTodayVisitors((prev) => prev + 1);
    }, 9500);

    // Rashi checked random intervals (increments by 1 to 3 every 3-7 seconds)
    const scheduleNextRashiIncrement = () => {
      const randomDelay = Math.floor(Math.random() * 4000) + 3000; // 3000ms - 7000ms
      return setTimeout(() => {
        setRashiChecked((prev) => prev + Math.floor(Math.random() * 3) + 1);
        rashiTimer = scheduleNextRashiIncrement();
      }, randomDelay);
    };

    let rashiTimer = scheduleNextRashiIncrement();

    return () => {
      clearInterval(liveInterval);
      clearInterval(todayInterval);
      clearTimeout(rashiTimer);
    };
  }, []);

  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2 rounded-2xl bg-navy-900/90 border border-gold-500/30 backdrop-blur-md shadow-gold-glow ${className}`}
      >
        {/* Live Fluctuating Counter */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-white font-mono transition-all">
            {liveVisitors}
          </span>
          <span className="text-[11px] text-gray-300 font-medium">
            {language === 'hi' ? 'लाइव जातक' : 'Live Online'}
          </span>
        </div>

        <span className="text-navy-700 hidden sm:inline">•</span>

        {/* Today's Total Visitors */}
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span className="text-xs font-bold text-gold-300 font-mono">
            {todayVisitors.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-gray-300 font-medium">
            {language === 'hi' ? 'आज के विज़िटर्स' : "Today's Visitors"}
          </span>
        </div>

        <span className="text-navy-700 hidden sm:inline">•</span>

        {/* Rashi Checked Incrementing Randomly */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
          <span className="text-xs font-bold text-amber-300 font-mono transition-all">
            {rashiChecked.toLocaleString('en-IN')}+
          </span>
          <span className="text-[11px] text-gray-300 font-medium">
            {language === 'hi' ? 'राशियाँ जांची गईं' : 'Rashis Checked'}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`w-full max-w-4xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 p-3 rounded-2xl bg-navy-950/80 border border-gold-500/30 text-center ${className}`}>
        <div className="p-2 sm:p-3 rounded-xl bg-navy-900/60 border border-emerald-500/20">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">
              {liveVisitors}
            </span>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-300 font-medium">
            {language === 'hi' ? 'लाइव जातक (अभी)' : 'Live Visitors Now'}
          </div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-navy-900/60 border border-gold-500/20">
          <div className="text-lg sm:text-2xl font-black text-gold-300 font-mono mb-1">
            {todayVisitors.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-300 font-medium">
            {language === 'hi' ? 'आज कुल विज़िटर्स' : "Today's Total Seekers"}
          </div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-navy-900/60 border border-amber-500/20">
          <div className="text-lg sm:text-2xl font-black text-amber-300 font-mono mb-1">
            {rashiChecked.toLocaleString('en-IN')}+
          </div>
          <div className="text-[10px] sm:text-xs text-gray-300 font-medium">
            {language === 'hi' ? 'राशियाँ जांची गईं' : 'Rashis Checked Today'}
          </div>
        </div>
      </div>
    );
  }

  // Default compact
  return (
    <div className={`inline-flex items-center gap-3 text-xs text-gray-300 ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <strong className="font-mono">{liveVisitors}</strong> {language === 'hi' ? 'लाइव' : 'Live'}
      </span>
      <span>•</span>
      <span>
        <strong className="text-gold-300 font-mono">{todayVisitors.toLocaleString('en-IN')}</strong> {language === 'hi' ? 'आज विज़िटर्स' : 'Today'}
      </span>
      <span>•</span>
      <span>
        <strong className="text-amber-300 font-mono">{rashiChecked.toLocaleString('en-IN')}+</strong> {language === 'hi' ? 'राशियाँ जांची' : 'Rashis'}
      </span>
    </div>
  );
}
