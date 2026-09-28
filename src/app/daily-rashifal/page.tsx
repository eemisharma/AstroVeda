'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Compass,
  Star,
  Briefcase,
  Heart,
  Activity,
  Flame,
  MessageSquare,
  Bot,
  ArrowRight,
  ShieldCheck,
  Share2,
  Check,
  Clock,
  Coins,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { getDailyHoroscope, DailyHoroscopeResponse, DailyRashifalData } from '@/lib/astrology/daily-rashifal';

export default function DailyRashifalPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<DailyHoroscopeResponse | null>(null);
  const [selectedRashiId, setSelectedRashiId] = useState<string>('aries');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate today's horoscope dynamically
    const horoscope = getDailyHoroscope(new Date());
    setData(horoscope);
  }, []);

  const currentRashi: DailyRashifalData | undefined = data?.rashifals.find(
    (r) => r.id === selectedRashiId
  ) || data?.rashifals[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareText = language === 'hi'
        ? `🌟 आज का ${currentRashi?.nameHi} राशिफल (${data?.dateFormattedHi}) पढ़ें AstroVeda पर बिल्कुल मुफ्त: ${window.location.href}`
        : `🌟 Read today's ${currentRashi?.nameEn} Horoscope (${data?.dateFormattedEn}) free on AstroVeda: ${window.location.href}`;

      if (navigator.share) {
        navigator.share({ title: 'AstroVeda Daily Rashifal', text: shareText, url: window.location.href }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest shadow-gold-glow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === 'hi' ? 'दैनिक राशिफल • 100% निःशुल्क' : 'Daily Horoscope • 100% Free'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
            {language === 'hi' ? 'आज का राशिफल' : "Today's Horoscope"}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {language === 'hi'
              ? 'प्रतिदिन प्रातः काल अपडेट होने वाला संपूर्ण 12 राशियों का वैदिक फलादेश। करियर, प्रेम, धन, स्वास्थ्य और आज का अचूक उपाय।'
              : 'Authentic daily Vedic planetary transits and predictions for all 12 Zodiac signs. Updated fresh every single day.'}
          </p>

          {/* Date & Moon Transit Pill */}
          {data && (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-navy-900/90 border border-navy-700 text-xs sm:text-sm text-gray-200 mt-2 shadow-sm">
              <span className="flex items-center gap-1.5 text-gold-300 font-semibold">
                <Calendar className="w-4 h-4 text-gold-400" />
                {language === 'hi' ? data.dateFormattedHi : data.dateFormattedEn}
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Compass className="w-3.5 h-3.5" />
                {language === 'hi' ? data.moonTransitHi : data.moonTransitEn}
              </span>
            </div>
          )}
        </div>

        {/* 12 Rashi Selection Horizontal Grid / Pills */}
        {data && (
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold text-gray-400 tracking-wider text-center sm:text-left">
              {language === 'hi' ? 'अपनी राशि चुनें:' : 'Select Your Zodiac Sign:'}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {data.rashifals.map((rashi) => {
                const isSelected = rashi.id === selectedRashiId;
                return (
                  <button
                    key={rashi.id}
                    onClick={() => setSelectedRashiId(rashi.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-b from-gold-500/20 to-amber-500/30 border-gold-400 text-white shadow-gold-glow scale-105 z-10'
                        : 'bg-navy-900/80 border-navy-800 text-gray-400 hover:text-gray-200 hover:bg-navy-800'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl mb-0.5">{rashi.symbol}</span>
                    <span className="text-xs font-bold font-heading">
                      {language === 'hi' ? rashi.nameHi : rashi.nameEn}
                    </span>
                    <span className="text-[9px] text-gray-500">
                      {rashi.signNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Rashi Detailed Card */}
        {currentRashi && (
          <div className="bg-navy-900/90 border border-gold-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-gold-glow-lg animate-page-enter">
            {/* Top Sign Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gold-400 via-amber-500 to-gold-600 flex items-center justify-center text-navy-950 font-black text-3xl shadow-gold-glow shrink-0">
                  {currentRashi.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                      {language === 'hi' ? currentRashi.sanskritName : `${currentRashi.nameEn} Horoscope`}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                      {language === 'hi' ? 'दैनिक राशिफल' : 'Daily Prediction'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {language === 'hi'
                      ? `स्वामी ग्रह: ${currentRashi.lordHi} | तत्व: ${currentRashi.element}`
                      : `Ruling Planet: ${currentRashi.lordEn} | Element: ${currentRashi.element}`}
                  </p>
                </div>
              </div>

              {/* Share & Cosmic Star Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-navy-950 px-3 py-1.5 rounded-xl border border-navy-800">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < currentRashi.rating
                          ? 'text-gold-400 fill-gold-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-gold-300 ml-1">
                    {currentRashi.rating}/5
                  </span>
                </div>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-navy-800 hover:bg-gold-500/20 border border-gold-500/30 text-gray-300 hover:text-gold-300 transition-all active:scale-95"
                  title="Share Today's Rashifal"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Auspicious Muhurat Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-navy-950/80 border border-gold-500/30">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gold-300 font-semibold">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>{language === 'hi' ? 'आज का शुभ मुहूर्त:' : 'Auspicious Timing:'}</span>
                <span className="text-white font-mono font-bold bg-navy-900 px-2 py-0.5 rounded-lg border border-navy-700">
                  {language === 'hi' ? currentRashi.shubhMuhuratHi : currentRashi.shubhMuhuratEn}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {data?.panchangHighlightHi}
              </span>
            </div>

            {/* 4 Domain Vitality Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-amber-400" />
                    {language === 'hi' ? 'करियर' : 'Career'}
                  </span>
                  <span className="font-bold text-amber-300 font-mono">{currentRashi.careerScore}%</span>
                </div>
                <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-gold-400 h-full rounded-full transition-all duration-700" style={{ width: `${currentRashi.careerScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    {language === 'hi' ? 'प्रेम' : 'Love'}
                  </span>
                  <span className="font-bold text-rose-300 font-mono">{currentRashi.loveScore}%</span>
                </div>
                <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-400 h-full rounded-full transition-all duration-700" style={{ width: `${currentRashi.loveScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-emerald-400" />
                    {language === 'hi' ? 'आर्थिक' : 'Finance'}
                  </span>
                  <span className="font-bold text-emerald-300 font-mono">{currentRashi.financeScore}%</span>
                </div>
                <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" style={{ width: `${currentRashi.financeScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-400" />
                    {language === 'hi' ? 'आरोग्य' : 'Health'}
                  </span>
                  <span className="font-bold text-blue-300 font-mono">{currentRashi.healthScore}%</span>
                </div>
                <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700" style={{ width: `${currentRashi.healthScore}%` }} />
                </div>
              </div>
            </div>

            {/* General Overview */}
            <div className="p-5 rounded-2xl bg-navy-950/70 border border-navy-800 space-y-2">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" />
                {language === 'hi' ? 'आज का मुख्य फलकथन' : "Today's General Outlook"}
              </span>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
                {language === 'hi' ? currentRashi.overviewHi : currentRashi.overviewEn}
              </p>
            </div>

            {/* 3 Life Domain Forecasts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Career & Finance */}
              <div className="p-5 rounded-2xl bg-navy-950/60 border border-navy-800 space-y-2 hover:border-gold-500/30 transition-colors">
                <div className="flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-wider font-heading">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>{language === 'hi' ? 'करियर एवं धन' : 'Career & Finance'}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {language === 'hi' ? currentRashi.careerHi : currentRashi.careerEn}
                </p>
              </div>

              {/* Love & Relationship */}
              <div className="p-5 rounded-2xl bg-navy-950/60 border border-navy-800 space-y-2 hover:border-gold-500/30 transition-colors">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider font-heading">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>{language === 'hi' ? 'प्रेम एवं दांपत्य' : 'Love & Relationships'}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {language === 'hi' ? currentRashi.loveHi : currentRashi.loveEn}
                </p>
              </div>

              {/* Health & Vitality */}
              <div className="p-5 rounded-2xl bg-navy-950/60 border border-navy-800 space-y-2 hover:border-gold-500/30 transition-colors">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-heading">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'hi' ? 'स्वास्थ्य एवं आरोग्य' : 'Health & Vitality'}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {language === 'hi' ? currentRashi.healthHi : currentRashi.healthEn}
                </p>
              </div>
            </div>

            {/* Lucky Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {language === 'hi' ? 'शुभ अंक' : 'Lucky Number'}
                </span>
                <p className="text-xl sm:text-2xl font-black text-gold-400 mt-0.5 font-mono">
                  {currentRashi.luckyNumber}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {language === 'hi' ? 'शुभ रंग' : 'Lucky Color'}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white mt-1">
                  {language === 'hi' ? currentRashi.luckyColorHi : currentRashi.luckyColorEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {language === 'hi' ? 'शुभ दिशा' : 'Lucky Direction'}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white mt-1">
                  {language === 'hi' ? currentRashi.luckyDirectionHi : currentRashi.luckyDirectionEn}
                </p>
              </div>
            </div>

            {/* Sacred Daily Remedy */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-gold-500/15 to-amber-500/10 border border-gold-500/40 space-y-1.5">
              <span className="text-xs font-bold text-gold-300 uppercase tracking-widest flex items-center gap-1.5 font-heading">
                <Flame className="w-4 h-4 text-amber-400" />
                {language === 'hi' ? 'आज का अचूक वैदिक उपाय' : "Today's Sacred Vedic Remedy"}
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                {language === 'hi' ? currentRashi.dailyRemedyHi : currentRashi.dailyRemedyEn}
              </p>
            </div>
          </div>
        )}

        {/* CTA to Paid Chat Live (₹99) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-950 border border-gold-500/40 text-center space-y-4 shadow-gold-glow animate-luxury-glow">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-bold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'व्यक्तिगत समाधान • केवल ₹99 में' : 'Personalized Consultation • Just ₹99'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
            {language === 'hi'
              ? 'क्या आप अपनी व्यक्तिगत जन्म कुंडली पर आचार्य जी से बात करना चाहते हैं?'
              : 'Want in-depth answers based on your exact Birth Kundali?'}
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            {language === 'hi'
              ? 'दैनिक राशिफल सामान्य गोचर पर आधारित होता है। अपनी जन्म तिथि, समय और स्थान के आधार पर अपने करियर, विवाह व धन के व्यक्तिगत प्रश्नों के लिए "Chat Live" शुरू करें।'
              : 'Daily horoscopes provide general transit insights. For exact answers based on your actual birth time, Lagna and Mahadasha, connect with our Live Consultation for just ₹99.'}
          </p>

          <div className="pt-2">
            <Link
              href="/consultation/ai-chat"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-sm sm:text-base hover:brightness-110 shadow-gold-glow transition-all active:scale-95"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{language === 'hi' ? 'Chat Live शुरू करें (केवल ₹99)' : 'Start Chat Live (Just ₹99)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
