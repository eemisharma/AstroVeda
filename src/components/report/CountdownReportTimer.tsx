'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { Clock, CheckCircle2, Sparkles, FastForward, Compass, FileText, ArrowRight, MessageSquare, Bell } from 'lucide-react';

interface CountdownReportTimerProps {
  createdAt?: string | Date;
  onComplete?: () => void;
  orderNumber: string;
  customerPhone?: string;
  customerName?: string;
  orderId?: string;
}

export default function CountdownReportTimer({
  createdAt,
  onComplete,
  orderNumber,
  customerPhone,
  customerName = 'प्रिय जातक',
  orderId,
}: CountdownReportTimerProps) {
  const { t, language } = useLanguage();
  const DURATION_SECONDS = 30 * 60; // 30 minutes
  const TIMER_START_KEY = `astroveda_timer_start_${orderNumber}`;
  const TIMER_BYPASS_KEY = `astroveda_timer_bypassed_${orderNumber}`;

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(TIMER_BYPASS_KEY) === 'true') {
        return 0;
      }
      const savedStart = localStorage.getItem(TIMER_START_KEY);
      if (savedStart) {
        const startTime = parseInt(savedStart, 10);
        if (!isNaN(startTime)) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          return Math.max(0, DURATION_SECONDS - elapsed);
        }
      } else if (createdAt) {
        const orderCreatedTime = new Date(createdAt).getTime();
        if (!isNaN(orderCreatedTime) && orderCreatedTime > 0) {
          localStorage.setItem(TIMER_START_KEY, String(orderCreatedTime));
          const elapsed = Math.floor((Date.now() - orderCreatedTime) / 1000);
          return Math.max(0, DURATION_SECONDS - elapsed);
        }
      }
      localStorage.setItem(TIMER_START_KEY, String(Date.now()));
    }
    return DURATION_SECONDS;
  });

  const [isBypassed, setIsBypassed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TIMER_BYPASS_KEY) === 'true';
    }
    return false;
  });
  const [notificationSent, setNotificationSent] = useState(false);
  const [showInAppPush, setShowInAppPush] = useState(false);

  // Sync remaining seconds on mount and initialize persistent start time
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (localStorage.getItem(TIMER_BYPASS_KEY) === 'true') {
      setIsBypassed(true);
      setRemainingSeconds(0);
      return;
    }

    let startTime: number;
    const savedStart = localStorage.getItem(TIMER_START_KEY);
    if (savedStart) {
      startTime = parseInt(savedStart, 10);
    } else if (createdAt) {
      const parsed = new Date(createdAt).getTime();
      startTime = !isNaN(parsed) && parsed > 0 ? parsed : Date.now();
      localStorage.setItem(TIMER_START_KEY, String(startTime));
    } else {
      startTime = Date.now();
      localStorage.setItem(TIMER_START_KEY, String(startTime));
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const rem = Math.max(0, DURATION_SECONDS - elapsed);
    setRemainingSeconds(rem);
  }, [orderNumber, createdAt, DURATION_SECONDS]);

  // Request browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const triggerPushNotifications = () => {
    if (notificationSent) return;
    setNotificationSent(true);
    setShowInAppPush(true);

    // 1. Browser Website Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('AstroVeda • आपकी वैदिक रिपोर्ट तैयार है! ✨', {
            body: `ऑर्डर #${orderNumber}: आपकी संपूर्ण जन्म कुंडली एवं ग्रह दशा विश्लेषण तैयार हो चुका है।`,
            icon: '/favicon.ico',
          });
        } catch (e) {
          console.warn('Native notification failed:', e);
        }
      }
    }

    // 2. WhatsApp Push Notification to Customer's Mobile Number
    fetch('/api/customer/notify-report-ready', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber,
        orderId,
        phone: customerPhone,
        customerName,
      }),
    }).catch(() => {});
  };

  useEffect(() => {
    if (remainingSeconds <= 0 || isBypassed) {
      triggerPushNotifications();
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      if (typeof window === 'undefined') return;
      const savedStart = localStorage.getItem(TIMER_START_KEY);
      const startTime = savedStart ? parseInt(savedStart, 10) : Date.now();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newRemaining = Math.max(0, DURATION_SECONDS - elapsed);

      setRemainingSeconds(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(interval);
        triggerPushNotifications();
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, isBypassed, onComplete]);

  const handleBypass = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TIMER_BYPASS_KEY, 'true');
    }
    setIsBypassed(true);
    setRemainingSeconds(0);
    triggerPushNotifications();
    if (onComplete) onComplete();
  };

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

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';
  const whatsappNotificationUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    language === 'hi'
      ? `🌟 नमस्ते AstroVeda! मेरे ऑर्डर #${orderNumber} की वैदिक रिपोर्ट तैयार हो चुकी है। कृपया मेरी रिपोर्ट की कॉपी मेरे व्हाट्सएप पर भी भेजें।`
      : `🌟 Hello AstroVeda! My Vedic consultation report for Order #${orderNumber} is now ready. Please send a copy to my WhatsApp.`
  )}`;

  if (isReady) {
    return (
      <div className="bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-gold-glow animate-fade-in space-y-4">
        {/* Floating In-App Push Notification Banner */}
        {showInAppPush && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 text-left animate-bounce">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'hi'
                  ? `🔔 नई सूचना: ऑर्डर #${orderNumber} की रिपोर्ट तैयार हो चुकी है!`
                  : `🔔 Alert: Your report for Order #${orderNumber} is ready!`}
              </span>
            </div>
            <button
              onClick={() => setShowInAppPush(false)}
              className="text-gray-400 hover:text-white text-xs px-2"
            >
              ✕
            </button>
          </div>
        )}

        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
          {language === 'hi' ? 'गणना पूर्ण' : 'Analysis Ready'}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
          {t('timerCompletedTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
          {t('timerCompletedSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              if (onComplete) onComplete();
              window.location.reload();
            }}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{t('viewReportNow')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* WhatsApp Push Notification Link */}
          <a
            href={whatsappNotificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{language === 'hi' ? 'व्हाट्सएप पर रिपोर्ट प्राप्त करें' : 'Get Report on WhatsApp'}</span>
          </a>
        </div>
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
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-4 max-w-full">
        {/* Minutes Box */}
        <div className="flex flex-col items-center">
          <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-2xl bg-navy-950/90 border border-gold-500/50 flex items-center justify-center text-2xl sm:text-4xl font-black text-gold-300 font-mono shadow-gold-glow">
            {formatDevanagari(minutes)}
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1.5 tracking-wider">
            {t('timerMinutes')}
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-gold-400 pb-5 animate-pulse">:</div>

        {/* Seconds Box */}
        <div className="flex flex-col items-center">
          <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-2xl bg-navy-950/90 border border-gold-500/50 flex items-center justify-center text-2xl sm:text-4xl font-black text-gold-300 font-mono shadow-gold-glow">
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
          onClick={handleBypass}
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
