'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { HINDI_SERVICES } from '@/lib/i18n/translations';
import { CONSULTATION_CATEGORIES } from '@/lib/constants/categories';
import { FALLBACK_SERVICES } from '@/lib/constants/services';
import CustomerCareDrawer from '@/components/customer-care/CustomerCareDrawer';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Check,
  Headphones,
  MessageSquare,
  Heart,
  Briefcase,
  Activity,
  Shield,
  ShieldCheck,
  Lock,
  FileText,
  Star,
  Zap,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  deliveryTime: string;
}

export default function ServicesListView({ services }: { services?: ServiceItem[] }) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [careDrawerOpen, setCareDrawerOpen] = useState(false);

  // Guarantee services are never empty even if DB fails or returns empty array
  const allServices: ServiceItem[] =
    services && services.length > 0 ? services : FALLBACK_SERVICES;

  const getServiceName = (s: ServiceItem) => {
    if (language === 'hi' && HINDI_SERVICES[s.slug]) {
      return HINDI_SERVICES[s.slug].name;
    }
    return s.name;
  };

  const getServiceDesc = (s: ServiceItem) => {
    if (language === 'hi' && HINDI_SERVICES[s.slug]) {
      return HINDI_SERVICES[s.slug].description;
    }
    return s.description;
  };

  const getServiceDelivery = (s: ServiceItem) => {
    if (language === 'hi' && HINDI_SERVICES[s.slug]) {
      return HINDI_SERVICES[s.slug].deliveryTime;
    }
    return s.deliveryTime;
  };

  // Filter services if category is selected
  const filteredServices =
    selectedCategory === 'all'
      ? allServices
      : allServices.filter((s) => {
          const cat = CONSULTATION_CATEGORIES.find((c) => c.id === selectedCategory);
          if (!cat) return true;
          return s.slug === cat.suggestedReportSlug || s.price === 499;
        });

  // Selected Category Info
  const activeCategoryObj = CONSULTATION_CATEGORIES.find(
    (c) => c.id === selectedCategory
  );

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Decorative Celestial Background Graphics */}
      <div className="relative overflow-hidden mb-8 sm:mb-12 rounded-3xl bg-gradient-to-b from-navy-900/90 via-navy-900/60 to-navy-950 border border-gold-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Central Vedic Yantra Graphic Header */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-5 flex items-center justify-center">
            {/* Outer Slow-Spinning Cosmic Astrolabe */}
            <svg
              className="w-20 h-20 sm:w-24 sm:h-24 animate-spin-slow drop-shadow-[0_0_18px_rgba(229,184,66,0.35)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="url(#headerGoldRing)"
                strokeWidth="1.5"
                strokeDasharray="3 4"
                opacity="0.8"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="url(#headerGoldRing)"
                strokeWidth="1"
                opacity="0.5"
              />
              {/* 12 Celestial Ray Points */}
              <g stroke="url(#headerGoldRing)" strokeWidth="1.5" strokeLinecap="round">
                <line x1="50" y1="2" x2="50" y2="10" />
                <line x1="50" y1="90" x2="50" y2="98" />
                <line x1="2" y1="50" x2="10" y2="50" />
                <line x1="90" y1="50" x2="98" y2="50" />
                <line x1="16" y1="16" x2="22" y2="22" />
                <line x1="78" y1="78" x2="84" y2="84" />
                <line x1="16" y1="84" x2="22" y2="78" />
                <line x1="78" y1="22" x2="84" y2="16" />
              </g>
              <defs>
                <linearGradient id="headerGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF1B8" />
                  <stop offset="50%" stopColor="#E5B842" />
                  <stop offset="100%" stopColor="#8A5A0D" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Glowing Sacred Sri Yantra / Core */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
              <svg
                className="w-12 h-12 sm:w-14 sm:h-14"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="30,12 46,42 14,42"
                  stroke="#E5B842"
                  strokeWidth="1.4"
                  fill="rgba(229,184,66,0.12)"
                />
                <polygon
                  points="30,48 46,18 14,18"
                  stroke="#F5C518"
                  strokeWidth="1.4"
                  fill="rgba(229,184,66,0.12)"
                />
                <circle cx="30" cy="30" r="3.5" fill="#E5B842" />
                <circle cx="30" cy="30" r="1.5" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-3 shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {language === 'hi'
                ? 'प्रामाणिक वैदिक गणना • 100% व्यक्तिगत मार्गदर्शन'
                : 'Authentic Vedic Astrology • 100% Personalized Guidance'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading mb-3 max-w-3xl">
            {language === 'hi'
              ? 'वैदिक ज्योतिष परामर्श एवं विस्तृत रिपोर्ट्स'
              : 'Vedic Astrological Consultations & Reports'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed mb-6">
            {language === 'hi'
              ? 'अपनी प्राथमिकताओं के अनुसार रिपोर्ट चुनें। प्रत्येक रिपोर्ट में सटीक लग्न, 12 भाव, 9 ग्रह व विंशोत्तरी महादशा की संपूर्ण गणना और व्यावहारिक वैदिक समाधान शामिल हैं।'
              : 'Choose the ideal consultation report. Every analysis includes accurate Lagna, 12 house placements, 9 planetary positions, active Vimshottari Mahadasha, and practical Vedic remedies.'}
          </p>

          {/* Quick Trust Highlights Banner (Mobile Friendly) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-3xl pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950/70 border border-navy-800 text-left">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="text-white font-bold block">30 मिनट</span>
                <span className="text-gray-400">त्वरित डिलीवरी</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950/70 border border-navy-800 text-left">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="text-white font-bold block">व्हाट्सएप चैट</span>
                <span className="text-gray-400">₹149 में सक्रिय</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950/70 border border-navy-800 text-left">
              <FileText className="w-4 h-4 text-gold-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="text-white font-bold block">द्विभाषी PDF</span>
                <span className="text-gray-400">आजीवन सुरक्षित</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950/70 border border-navy-800 text-left">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="text-white font-bold block">100% गोपनीय</span>
                <span className="text-gray-400">256-बिट सुरक्षित</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Horizontal Swipeable Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {language === 'hi' ? 'समस्या के अनुसार परामर्श चुनें:' : 'Filter by consultation need:'}
            </span>
          </span>
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            {language === 'hi' ? '← स्वाइप करें →' : '← Swipe to view all →'}
          </span>
        </div>

        {/* Scrollable Container with Smooth Touch Flicking */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5 snap-x">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-gold-glow border border-gold-400'
                : 'bg-navy-900 border border-navy-700 text-gray-300 hover:border-gold-500/40 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'समस्त 5 रिपोर्ट्स' : 'All 5 Reports'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-navy-950/20 text-navy-950 font-black'
                  : 'bg-navy-800 text-gold-400'
              }`}
            >
              5
            </span>
          </button>

          {CONSULTATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const getIcon = () => {
              if (cat.id === 'love-relationship') return <Heart className="w-3.5 h-3.5 text-pink-400" />;
              if (cat.id === 'job-money-business') return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
              if (cat.id === 'health-disease') return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
              return <Shield className="w-3.5 h-3.5 text-purple-400" />;
            };

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 snap-start flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-gold-glow border border-gold-400'
                    : 'bg-navy-900 border border-navy-700 text-gray-300 hover:border-gold-500/40 hover:text-white'
                }`}
              >
                {getIcon()}
                <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Recommendation Insight Banner */}
      {activeCategoryObj && selectedCategory !== 'all' && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/40 shadow-gold-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Star className="w-5 h-5 text-gold-400 fill-gold-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded">
                  {language === 'hi' ? 'विशेषज्ञ संस्तुति' : 'Expert Recommendation'}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {language === 'hi' ? activeCategoryObj.nameHi : activeCategoryObj.nameEn}
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-1 leading-relaxed max-w-2xl font-normal">
                {language === 'hi' ? activeCategoryObj.subtitleHi : activeCategoryObj.subtitleEn}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 shrink-0 self-end sm:self-center"
          >
            {language === 'hi' ? 'सभी 5 देखें ↺' : 'Show All 5 ↺'}
          </button>
        </div>
      )}

      {/* Services Grid (Mobile Stacked, Desktop 2-Cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {filteredServices.map((s) => {
          const isPremium = s.price === 499 || s.slug === 'premium-master-horoscope';
          const isWhatsApp = s.price === 149 || s.slug === 'vedic-kundli-whatsapp';
          const isPopular = s.price === 99 || s.slug === 'comprehensive-destiny';
          const isTransit = s.price === 89 || s.slug === 'life-direction-transit';
          const isQuick = s.price === 49 || s.slug === 'quick-kundli-glance';

          // Custom SVG Emblem for each tier
          const renderServiceGraphic = () => {
            if (isQuick) {
              return (
                <div className="relative w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-amber-400 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                </div>
              );
            }
            if (isTransit) {
              return (
                <div className="relative w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-sky-400 animate-spin-reverse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" fillOpacity="0.3" />
                  </svg>
                </div>
              );
            }
            if (isPopular) {
              return (
                <div className="relative w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center shrink-0 shadow-gold-glow animate-float">
                  <svg className="w-7 h-7 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="12,2 22,12 12,22 2,12" strokeWidth="1.8" fill="rgba(229,184,66,0.15)" />
                    <line x1="12" y1="2" x2="12" y2="22" strokeWidth="1.2" />
                    <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1.2" />
                    <circle cx="12" cy="12" r="2.5" fill="#E5B842" />
                  </svg>
                </div>
              );
            }
            if (isWhatsApp) {
              return (
                <div className="relative w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-emerald-glow animate-emerald-pulse">
                  <MessageSquare className="w-6 h-6 text-emerald-400" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
              );
            }
            // Master 499
            return (
              <div className="relative w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center shrink-0 animate-float">
                <svg className="w-7 h-7 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="rgba(168,85,247,0.2)" />
                </svg>
              </div>
            );
          };

          return (
            <div
              key={s.id}
              className={`flex flex-col justify-between rounded-3xl p-6 sm:p-7 relative transition-all duration-300 hover:-translate-y-1 ${
                isWhatsApp
                  ? 'bg-gradient-to-b from-navy-900 via-navy-900 to-emerald-950/20 border-2 border-emerald-500/60 shadow-emerald-glow'
                  : isPopular
                  ? 'bg-gradient-to-b from-navy-900 via-navy-900 to-gold-950/20 border-2 border-gold-500/60 shadow-gold-glow'
                  : isPremium
                  ? 'bg-gradient-to-b from-navy-900 via-navy-900 to-purple-950/20 border border-purple-500/40'
                  : 'bg-navy-900 border border-navy-700/80 hover:border-gold-500/40 hover:shadow-xl'
              }`}
            >
              {/* Top Floating Badge */}
              {isWhatsApp ? (
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-navy-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-navy-950" />
                  <span>{language === 'hi' ? 'सर्वश्रेष्ठ मूल्य • रिपोर्ट + व्हाट्सएप' : 'Best Value • Report + Chat'}</span>
                </span>
              ) : isPopular ? (
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-navy-950" />
                  <span>{language === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}</span>
                </span>
              ) : isPremium ? (
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-amber-500 text-navy-950 text-[10px] font-black uppercase tracking-wider shadow">
                  {t('tier499Badge')}
                </span>
              ) : isQuick ? (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-navy-800 border border-gold-500/40 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                  {language === 'hi' ? 'प्रारंभिक रिपोर्ट' : 'Starter Report'}
                </span>
              ) : (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-navy-800 border border-sky-500/40 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                  {language === 'hi' ? 'गोचर विश्लेषण' : 'Transit Guide'}
                </span>
              )}

              <div>
                {/* Header with Emblem & Price */}
                <div className="flex items-start justify-between gap-3 mb-4 pt-1">
                  <div className="flex items-center gap-3">
                    {renderServiceGraphic()}
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-heading leading-snug">
                        {getServiceName(s)}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {t('serviceDeliveryLabel')} {getServiceDelivery(s)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-2xl sm:text-3xl font-black font-heading ${
                        isWhatsApp
                          ? 'text-emerald-400'
                          : isPopular
                          ? 'text-gold-400'
                          : isPremium
                          ? 'text-amber-400'
                          : 'text-white'
                      }`}
                    >
                      ₹{s.price}
                    </div>
                    {isWhatsApp && (
                      <span className="text-[10px] text-emerald-400/90 block font-medium">
                        {language === 'hi' ? 'चैट शामिल' : 'Chat included'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                  {getServiceDesc(s)}
                </p>

                {/* Service Feature Highlights */}
                <div className="space-y-2.5 mb-7 bg-navy-950/50 p-4 rounded-2xl border border-navy-800/80">
                  <div className="flex items-center gap-2 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('serviceFeatureChart')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('serviceFeatureDasha')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('serviceFeatureDashboard')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-200 font-medium">
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        isWhatsApp ? 'text-emerald-400' : 'text-emerald-400'
                      }`}
                    />
                    <span className={isWhatsApp ? 'text-emerald-300 font-bold' : ''}>
                      {isWhatsApp
                        ? language === 'hi'
                          ? 'सक्रिय व्हाट्सएप लाइव परामर्श सम्मिलित'
                          : 'Live WhatsApp astrologer session included'
                        : isPopular
                        ? language === 'hi'
                          ? '12 भावों का 2-वर्षीय महादशा फल'
                          : 'Complete 12-house 2-year dasha reading'
                        : t('serviceFeatureWhatsApp')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile Friendly Large Tap Targets */}
              <div className="pt-4 border-t border-navy-800/80 flex items-center justify-between gap-3">
                <Link
                  href={`/services/${s.slug}`}
                  className="text-xs font-bold text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-navy-800/60 transition-colors"
                >
                  {t('learnMore')}
                </Link>

                {isPremium ? (
                  <button
                    type="button"
                    onClick={() => setCareDrawerOpen(true)}
                    className="py-3 px-5 sm:px-6 rounded-xl bg-navy-800 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-navy-750 flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <span>{language === 'hi' ? 'पूर्व-बुकिंग एवं विवरण' : 'Pre-book & Info'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : isWhatsApp ? (
                  <Link
                    href={`/checkout/${s.slug}`}
                    className="py-3.5 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-navy-950 font-black text-xs hover:brightness-110 shadow-emerald-glow flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-navy-950" />
                    <span>{language === 'hi' ? 'परामर्श शुरू करें' : 'Start Consultation'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href={`/checkout/${s.slug}`}
                    className="py-3.5 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs hover:brightness-110 shadow-gold-glow flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <span>{t('proceedToConsultation')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Bottom Help Section for Mobile & Desktop */}
      <div className="mt-12 sm:mt-16 bg-navy-900/90 border border-gold-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-gold-glow relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-3 shadow-gold-glow">
            <Headphones className="w-6 h-6 text-gold-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-heading">
            {language === 'hi'
              ? 'असमंजस में हैं कि आपके लिए कौन सी रिपोर्ट सही है?'
              : 'Unsure which report fits your situation?'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
            {language === 'hi'
              ? 'हमारी सहायता टीम से निःशुल्क मार्गदर्शन प्राप्त करें। हम आपकी समस्या के अनुसार सबसे उपयुक्त परामर्श व उपाय सुझाएंगे।'
              : 'Get free guidance from our customer care team. We will recommend the best report suited to your questions.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCareDrawerOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shadow-gold-glow transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'निःशुल्क मार्गदर्शन लें' : 'Get Free Guidance'}</span>
            </button>
            <a
              href="https://wa.me/919876543210?text=नमस्ते%20AstroVeda,%20मुझे%20परामर्श%20रिपोर्ट%20चुनने%20में%20मार्गदर्शन%20चाहिए।"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'hi' ? 'व्हाट्सएप पर पूछें' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>

      <CustomerCareDrawer isOpen={careDrawerOpen} onClose={() => setCareDrawerOpen(false)} />
    </div>
  );
}
