'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { Clock, CheckCircle2, Sparkles, FastForward, Compass, FileText, ArrowRight } from 'lucide-react';

interface CountdownReportTimerProps {
  createdAt: string | Date;
  onComplete?: () => void;
  orderNumber: string;
}

export default function CountdownReportTimer({
  createdAt,
  onComplete,
  orderNumber,
}: CountdownReportTimerProps) {
  const { t, language } = useLanguage();
  const DURATION_SECONDS = 30 * 60; // 30 minutes

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    try {
      const createdTime = new Date(createdAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - createdTime) / 1000);
      return Math.max(0, DURATION_SECONDS - elapsed);
    } catch {
      return DURATION_SECONDS;
    }
  });

  const [isBypassed, setIsBypassed] = useState(false);

  useEffect(() => {
    if (remainingSeconds <= 0 || isBypassed) {
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, isBypassed, onComplete]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formatDevanagari = (num: number): string => {
    return String(num).padStart(2, '0');
  };

  const elapsedSeconds = DURATION_SECONDS - remainingSeconds;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / DURATION_SECONDS) * 100));

  // Determine active stage
  let activeStageIndex = 0;
  if (elapsedSeconds >= 25 * 60) activeStageIndex = 3;
  else if (elapsedSeconds >= 15 * 60) activeStageIndex = 2;
  else if (elapsedSeconds >= 5 * 60) activeStageIndex = 1;

  const stages = [
    { title: t('timerStage1Title'), time: '0–5 mins' },
    { title: t('timerStage2Title'), time: '5–15 mins' },
    { title: t('timerStage3Title'), time: '15–25 mins' },
    { title: t('timerStage4Title'), time: '25–30 mins' },
  ];

  const isReady = remainingSeconds === 0 || isBypassed;

  if (isReady) {
    return (
      <div className="bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-gold-glow animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
          {language === 'hi' ? 'गणना पूर्ण' : 'Analysis Ready'}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white font-heading mb-2">
          {t('timerCompletedTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
          {t('timerCompletedSubtitle')}
        </p>
        <button
          onClick={() => {
            if (onComplete) onComplete();
            window.location.reload();
          }}
          type="button"
          className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>{t('viewReportNow')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-gold-glow-lg text-center space-y-6">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t('timerBadge')}</span>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
          {t('timerHeading')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mt-1.5 leading-relaxed">
          {t('timerSubheading')}
        </p>
        <div className="text-[11px] text-gold-400 font-mono mt-2">
          Order #{orderNumber}
        </div>
      </div>

      {/* Countdown Digits */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-4">
        {/* Minutes Box */}
        <div className="flex flex-col items-center">
          <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-navy-950/90 border border-gold-500/50 flex items-center justify-center text-3xl sm:text-4xl font-black text-gold-300 font-mono shadow-gold-glow">
            {formatDevanagari(minutes)}
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1.5 tracking-wider">
            {t('timerMinutes')}
          </span>
        </div>

        <div className="text-3xl font-black text-gold-400 pb-5 animate-pulse">:</div>

        {/* Seconds Box */}
        <div className="flex flex-col items-center">
          <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-navy-950/90 border border-gold-500/50 flex items-center justify-center text-3xl sm:text-4xl font-black text-gold-300 font-mono shadow-gold-glow">
            {formatDevanagari(seconds)}
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1.5 tracking-wider">
            {t('timerSeconds')}
          </span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="max-w-md mx-auto space-y-1.5">
        <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
          <span>{language === 'hi' ? 'गणना प्रगति' : 'Analysis Progress'}</span>
          <span className="text-gold-400 font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-navy-950 border border-navy-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 via-amber-400 to-emerald-400 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Vedic Stages Timeline */}
      <div className="max-w-lg mx-auto text-left space-y-2.5 pt-2">
        {stages.map((stage, idx) => {
          const isDone = idx < activeStageIndex;
          const isCurrent = idx === activeStageIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                isCurrent
                  ? 'bg-gold-500/15 border-gold-500/50 text-white shadow-gold-glow'
                  : isDone
                  ? 'bg-navy-950/60 border-emerald-500/30 text-emerald-300'
                  : 'bg-navy-950/30 border-navy-800 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Compass className="w-4 h-4 text-gold-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-600 shrink-0" />
                )}
                <span className={`font-medium ${isCurrent ? 'text-gold-200 font-semibold' : ''}`}>
                  {stage.title}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-2">
                {stage.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dev Bypass Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            setIsBypassed(true);
            if (onComplete) onComplete();
          }}
          type="button"
          className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gold-400 transition-colors underline"
        >
          <FastForward className="w-3 h-3" />
          <span>{t('skipTimerDev')}</span>
        </button>
      </div>
    </div>
  );
}
