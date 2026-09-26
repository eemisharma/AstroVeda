'use client';

import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Compass,
  Star,
  Zap,
  ChevronDown,
  Check,
} from 'lucide-react';
import VedicChartSvg from '@/components/kundli/VedicChartSvg';
import { ChartData } from '@/lib/astrology/types';
import { useLanguage } from '@/lib/i18n/context';
import { CONSULTATION_CATEGORIES } from '@/lib/constants/categories';
import { HINDI_SERVICES } from '@/lib/i18n/translations';
import CustomerCareDrawer from '@/components/customer-care/CustomerCareDrawer';
import { useState, useRef, useEffect } from 'react';
import { Heart, Briefcase, Activity, Headphones, Shield } from 'lucide-react';

interface HomeViewProps {
  services: any[];
}

const sampleDemoChart: ChartData = {
  ascendant: {
    sign: 'Scorpio (Vrishchika)',
    signNumber: 8,
    degree: 14.5,
    nakshatra: 'Anuradha',
  },
  moonSign: 'Taurus (Vrishabha)',
  sunSign: 'Leo (Simha)',
  nakshatra: 'Rohini',
  nakshatraPada: 2,
  nakshatraLord: 'Moon',
  planets: [
    { name: 'Sun', sanskritName: 'Surya', sign: 'Leo (Simha)', signNumber: 5, degree: 18.2, house: 10, nakshatra: 'Purva Phalguni', nakshatraLord: 'Venus', pada: 2, isRetrograde: false },
    { name: 'Moon', sanskritName: 'Chandra', sign: 'Taurus (Vrishabha)', signNumber: 2, degree: 12.4, house: 7, nakshatra: 'Rohini', nakshatraLord: 'Moon', pada: 2, isRetrograde: false },
    { name: 'Mars', sanskritName: 'Mangal', sign: 'Aries (Mesha)', signNumber: 1, degree: 22.1, house: 6, nakshatra: 'Bharani', nakshatraLord: 'Venus', pada: 3, isRetrograde: false },
    { name: 'Mercury', sanskritName: 'Budha', sign: 'Virgo (Kanya)', signNumber: 6, degree: 5.7, house: 11, nakshatra: 'Uttara Phalguni', nakshatraLord: 'Sun', pada: 4, isRetrograde: false },
    { name: 'Jupiter', sanskritName: 'Guru', sign: 'Sagittarius (Dhanu)', signNumber: 9, degree: 9.3, house: 2, nakshatra: 'Mula', nakshatraLord: 'Ketu', pada: 3, isRetrograde: false },
    { name: 'Venus', sanskritName: 'Shukra', sign: 'Libra (Tula)', signNumber: 7, degree: 16.8, house: 12, nakshatra: 'Swati', nakshatraLord: 'Rahu', pada: 3, isRetrograde: false },
    { name: 'Saturn', sanskritName: 'Shani', sign: 'Aquarius (Kumbha)', signNumber: 11, degree: 24.0, house: 4, nakshatra: 'Purva Bhadrapada', nakshatraLord: 'Jupiter', pada: 2, isRetrograde: true },
    { name: 'Rahu', sanskritName: 'Rahu', sign: 'Pisces (Meena)', signNumber: 12, degree: 8.9, house: 5, nakshatra: 'Uttara Bhadrapada', nakshatraLord: 'Saturn', pada: 2, isRetrograde: true },
    { name: 'Ketu', sanskritName: 'Ketu', sign: 'Virgo (Kanya)', signNumber: 6, degree: 8.9, house: 11, nakshatra: 'Uttara Phalguni', nakshatraLord: 'Sun', pada: 4, isRetrograde: true },
  ],
  houses: [],
  dasha: {
    currentMahadasha: 'Jupiter',
    currentAntardasha: 'Saturn',
    startDate: '2023-01-01',
    endDate: '2026-06-30',
    sequence: [],
  },
  isMockData: true,
  generatedAt: new Date().toISOString(),
};

export default function HomeView({ services }: HomeViewProps) {
  const { t, language } = useLanguage();
  const [careDrawerOpen, setCareDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(
    services[0]?.slug || 'quick-kundli-glance'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedService =
    services.find((s) => s.slug === selectedServiceSlug) ||
    services[0] || {
      slug: 'quick-kundli-glance',
      price: 49,
      name: 'Quick Kundli Glance & Planetary Insights',
      deliveryTime: '30 mins',
    };

  const primaryService = selectedService;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getServiceName = (s: any) => {
    if (language === 'hi' && HINDI_SERVICES[s.slug]) {
      return HINDI_SERVICES[s.slug].name;
    }
    return s.name;
  };

  const getServiceDesc = (s: any) => {
    if (language === 'hi' && HINDI_SERVICES[s.slug]) {
      return HINDI_SERVICES[s.slug].description;
    }
    return s.description;
  };

  const getServiceDelivery = (s: any) => {
    if (language === 'hi' && HINDI_SERVICES[s.slug]) {
      return HINDI_SERVICES[s.slug].deliveryTime;
    }
    return s.deliveryTime;
  };

  const faqs = [
    {
      q: language === 'hi' ? 'मुझे क्या जानकारी प्रदान करनी होगी?' : 'What information do I need to provide?',
      a: language === 'hi'
        ? 'सटीक वैदिक कुंडली तैयार करने के लिए आपको जन्म तिथि, सटीक जन्म समय और जन्म शहर/स्थान प्रदान करना होगा। लिंग चयन विकल्प भी उपलब्ध है।'
        : 'You will need your exact Date of Birth, Time of Birth, and Birth City. An optional gender selection helps personalize pronouns.',
    },
    {
      q: language === 'hi' ? 'सटीक जन्म समय इतना महत्वपूर्ण क्यों है?' : 'Why is exact birth time so important?',
      a: language === 'hi'
        ? 'वैदिक ज्योतिष में लग्न (Ascendant) प्रत्येक 2 घंटे में बदल जाता है। सटीक समय से ही आपके 12 भाव, ग्रह स्थितियां और महादशा का सही निर्धारण होता है।'
        : 'In Vedic astrology, the Ascendant (Lagna) changes zodiac signs approximately every two hours. Exact birth time determines the precise house cusps and dasha timings.',
    },
    {
      q: language === 'hi' ? 'विश्लेषण तैयार होने में कितना समय लगता है?' : 'How long does the analysis take to prepare?',
      a: language === 'hi'
        ? 'अधिकांश विश्लेषण कुछ ही मिनटों में या चुनी गई सेवा के आधार पर 12 से 24 घंटों में तैयार हो जाते हैं। आप बेझिझक पेज बंद कर सकते हैं, तैयार होने पर व्हाट्सएप सूचना मिल जाएगी।'
        : 'Most analyses are processed in real-time or within 12 to 24 hours depending on the chosen service. You can safely leave this page and check your customer dashboard at any time.',
    },
    {
      q: language === 'hi' ? 'मुझे अपनी रिपोर्ट कैसे प्राप्त होगी?' : 'How will I receive my report?',
      a: language === 'hi'
        ? 'रिपोर्ट तैयार होते ही आपको व्हाट्सएप पर सीधा लिंक प्राप्त होगा। यह आपके ग्राहक डैशबोर्ड में भी सुरक्षित रहेगी जहां से आप पीडीएफ डाउनलोड कर सकते हैं।'
        : 'You will receive a WhatsApp notification with a direct link the moment your report is ready. It remains permanently accessible in your secure Customer Dashboard with PDF download.',
    },
    {
      q: language === 'hi' ? 'क्या मेरी जन्म जानकारी सुरक्षित है?' : 'Is my birth information secure?',
      a: language === 'hi'
        ? 'हां, बिल्कुल। हम 256-बिट एसएसएल एन्क्रिप्शन का उपयोग करते हैं और आपकी जानकारी कभी किसी विज्ञापनदाता या तीसरे पक्ष के साथ साझा नहीं की जाती।'
        : 'Yes. We implement bank-grade encryption, secure server-side sessions, and strict access controls. Only you and authorized system administrators can view your consultation.',
    },
    {
      q: language === 'hi' ? 'यदि भुगतान विफल हो जाए तो क्या होगा?' : 'What happens if my payment fails?',
      a: language === 'hi'
        ? 'यदि बैंक या नेटवर्क के कारण भुगतान असफल रहता है, तो आपके खाते से कोई राशि नहीं काटी जाएगी। आप तुरंत पुनः प्रयास कर सकते हैं या हमारे व्हाट्सएप पर सहायता ले सकते हैं।'
        : 'If payment is interrupted or declined by your bank, no charge is captured. You will be redirected to a payment retry page, and our WhatsApp support is readily available to assist.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-navy-950 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none">
          <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-gold-500/10 via-mystic-500/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute top-[80px] left-1/4 w-[350px] h-[350px] bg-mystic-600/10 blur-3xl rounded-full" />
          <div className="absolute top-[120px] right-1/4 w-[300px] h-[300px] bg-gold-400/10 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-6 shadow-gold-glow backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.2] mb-6 font-heading">
            {t('heroTitlePart1')}
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
            {t('heroTitlePart2')}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
            {t('heroSubtitle')}
          </p>

          {/* Hero Action with Dropdown Selection in Ascending Order */}
          <div ref={dropdownRef} className="relative max-w-xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
              {/* Primary "Get Report" button with Dropdown toggle */}
              <div className="relative flex-1">
                <div className="flex rounded-xl overflow-hidden shadow-gold-glow bg-gradient-to-r from-gold-500 to-gold-600">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex-1 px-5 py-4 text-navy-950 font-bold text-base hover:brightness-110 flex items-center justify-center gap-2 transition-all text-left"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <Sparkles className="w-4 h-4 text-navy-950 shrink-0" />
                    <span className="truncate">
                      {t('heroPrimaryCta')} • ₹{selectedService.price}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <Link
                    href={
                      selectedService.price === 499
                        ? '/services'
                        : `/checkout/${selectedService.slug}`
                    }
                    className="px-4 py-4 bg-navy-950/20 hover:bg-navy-950/30 text-navy-950 flex items-center justify-center border-l border-navy-950/10 transition-colors"
                    title={language === 'hi' ? 'सीधे चेकआउट पर जाएं' : 'Proceed directly to checkout'}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Secondary CTA: View All Services */}
              <Link
                href="/services"
                className="px-6 py-4 rounded-xl bg-navy-900 border border-navy-700 hover:border-gold-500/40 text-gray-200 font-semibold text-base hover:bg-navy-850 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
              >
                <span>{t('heroSecondaryCta')}</span>
              </Link>
            </div>

            {/* Helper label beneath button */}
            <div className="flex items-center justify-center gap-2 mt-2.5 text-xs text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {language === 'hi'
                  ? 'मूल्य ₹49 से शुरू • ऊपर क्लिक करके सभी रिपोर्ट विकल्प देखें'
                  : 'Starting at ₹49 • Click above to explore all ascending tiers'}
              </span>
            </div>

            {/* Dropdown Menu - All Services in Strict Ascending Order */}
            {dropdownOpen && (
              <div
                role="listbox"
                className="absolute left-0 right-0 top-full mt-3 z-50 bg-navy-900/98 backdrop-blur-xl border-2 border-gold-500/60 rounded-3xl p-3 sm:p-4 shadow-2xl text-left"
              >
                <div className="flex items-center justify-between px-2 py-2 border-b border-navy-800 mb-2.5">
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    {language === 'hi'
                      ? 'अपनी रिपोर्ट चुनें (आरोही क्रम: ₹49 से)'
                      : 'Select Your Report (Ascending Order)'}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {language === 'hi' ? '5 सक्रिय सेवाएं' : '5 active tiers'}
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {services.map((s) => {
                    const isSelected = s.slug === selectedService.slug;
                    const isPremium = s.price === 499 || s.slug === 'premium-master-horoscope';
                    const isWhatsApp = s.price === 149 || s.slug === 'vedic-kundli-whatsapp';

                    return (
                      <div
                        key={s.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedServiceSlug(s.slug);
                          setDropdownOpen(false);
                          if (isPremium) {
                            setCareDrawerOpen(true);
                          } else {
                            window.location.href = `/checkout/${s.slug}`;
                          }
                        }}
                        className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-glow'
                            : 'bg-navy-950/80 border-navy-800 hover:border-gold-500/50 hover:bg-navy-850 text-gray-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-lg font-black font-mono ${
                                isPremium
                                  ? 'bg-amber-500 text-navy-950'
                                  : isWhatsApp
                                  ? 'bg-emerald-500 text-navy-950'
                                  : 'bg-gold-500 text-navy-950'
                              }`}
                            >
                              ₹{s.price}
                            </span>
                            <h4 className="text-sm font-bold text-white truncate font-heading">
                              {getServiceName(s)}
                            </h4>
                            {isPremium && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-semibold">
                                {language === 'hi' ? 'प्रीमियम • आगामी' : 'Premium • Coming Soon'}
                              </span>
                            )}
                            {isWhatsApp && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold">
                                {language === 'hi' ? 'व्हाट्सएप चैट शामिल' : 'WhatsApp Chat Included'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {getServiceDesc(s)}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                            <Clock className="w-3 h-3 text-gold-400" />
                            <span>
                              {t('serviceDeliveryLabel')} {getServiceDelivery(s)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isSelected ? (
                            <div className="w-7 h-7 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center font-bold">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-navy-800 border border-navy-700 text-gray-400 flex items-center justify-center group-hover:text-gold-400 group-hover:border-gold-500">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2.5 border-t border-navy-800 flex items-center justify-between text-xs text-gray-400 px-2">
                  <span>
                    {language === 'hi'
                      ? 'किसी भी रिपोर्ट पर क्लिक कर सीधे चेकआउट करें'
                      : 'Click any tier to proceed to checkout'}
                  </span>
                  <span className="text-gold-400 font-bold font-mono">
                    ₹49 • ₹89 • ₹99 • ₹149 • ₹499
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto mt-12 pt-8 border-t border-navy-800/80 text-center text-xs text-gray-400">
            <div>
              <div className="font-bold text-white text-sm sm:text-base">{t('badgePrivate')}</div>
            </div>
            <div>
              <div className="font-bold text-white text-sm sm:text-base">{t('badgeVedic')}</div>
            </div>
            <div>
              <div className="font-bold text-white text-sm sm:text-base">{t('badgeWhatsApp')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 CORE CONSULTATION CATEGORIES */}
      <section className="py-16 bg-navy-900/50 border-y border-navy-800/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              {language === 'hi' ? 'विशेषज्ञ परामर्श एवं उपाय' : 'Core Consultation Areas'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
              {t('categorySectionTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl mx-auto">
              {t('categorySectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSULTATION_CATEGORIES.map((cat) => {
              const IconComponent =
                cat.id === 'love-relationship'
                  ? Heart
                  : cat.id === 'job-money-business'
                  ? Briefcase
                  : cat.id === 'health-disease'
                  ? Activity
                  : Shield;

              return (
                <div
                  key={cat.id}
                  className="bg-navy-900/90 border border-navy-700/70 hover:border-gold-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center border shadow-sm`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-heading group-hover:text-gold-300 transition-colors">
                          {language === 'hi' ? cat.nameHi : cat.nameEn}
                        </h3>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {language === 'hi' ? cat.subtitleHi : cat.subtitleEn}
                        </span>
                      </div>
                    </div>

                    {/* Suggested remedies tags */}
                    <div className="mt-4 pt-3 border-t border-navy-800 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                        {language === 'hi' ? 'अभिमंत्रित वैदिक उपाय उत्पाद:' : 'Consecrated Remedies:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.suggestedProducts.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-navy-950/80 border border-navy-700 text-gray-300 flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-gold-400" />
                            <span>{language === 'hi' ? p.nameHi : p.nameEn}</span>
                            <span className="text-gold-400 font-semibold font-mono ml-0.5">₹{p.price}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-navy-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCareDrawerOpen(true)}
                      className="text-xs font-semibold text-gray-400 hover:text-gold-400 flex items-center gap-1 transition-colors"
                    >
                      <Headphones className="w-3.5 h-3.5 text-gold-400" />
                      <span>{language === 'hi' ? 'उपाय परामर्श लें' : 'Remedy Guidance'}</span>
                    </button>

                    <Link
                      href={`/checkout/${cat.suggestedReportSlug}`}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all"
                    >
                      <span>{language === 'hi' ? 'परामर्श बुक करें' : 'Get Guidance'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 STEPS) */}
      <section className="py-16 bg-navy-900/60 border-b border-navy-800/80 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              {t('howItWorksBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
              {t('howItWorksTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 relative hover:border-gold-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-black text-sm mb-4">
                {t('step1Num')}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step1Title')}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t('step1Desc')}</p>
            </div>

            <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 relative hover:border-gold-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-mystic-500/10 border border-mystic-500/30 flex items-center justify-center text-mystic-400 font-black text-sm mb-4">
                {t('step2Num')}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step2Title')}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t('step2Desc')}</p>
            </div>

            <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 relative hover:border-gold-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-black text-sm mb-4">
                {t('step3Num')}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step3Title')}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t('step3Desc')}</p>
            </div>

            <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 relative hover:border-gold-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm mb-4">
                {t('step4Num')}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step4Title')}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t('step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION (5 TIERS) */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              {t('servicesBadge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 font-heading">
              {t('servicesTitle')}
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto">
              {t('servicesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s, idx) => {
              const isPremium = s.price === 499 || s.slug === 'premium-master-horoscope';
              const isWhatsApp = s.price === 149 || s.slug === 'vedic-kundli-whatsapp';

              return (
                <div
                  key={s.id}
                  className={`flex flex-col justify-between bg-navy-900 border rounded-3xl p-6 sm:p-7 relative transition-all hover:scale-[1.01] ${
                    isPremium
                      ? 'border-purple-500/50 bg-gradient-to-b from-navy-900 via-navy-900 to-purple-950/20'
                      : isWhatsApp
                      ? 'border-emerald-500/50 shadow-emerald-glow bg-gradient-to-b from-navy-900 to-navy-850'
                      : idx === 0
                      ? 'border-gold-500/60 shadow-gold-glow bg-gradient-to-b from-navy-900 to-navy-850'
                      : 'border-navy-700/80 hover:border-gold-500/30'
                  }`}
                >
                  {isPremium ? (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {t('tier499Badge')}
                    </span>
                  ) : isWhatsApp ? (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {t('tier149Badge')}
                    </span>
                  ) : s.price === 99 || s.slug === 'comprehensive-destiny' ? (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {t('tier99Badge')}
                    </span>
                  ) : s.price === 49 || s.slug === 'quick-kundli-glance' ? (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {t('tier49Badge')}
                    </span>
                  ) : s.price === 89 || s.slug === 'life-direction-transit' ? (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {t('tier89Badge')}
                    </span>
                  ) : null}

                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                          {getServiceName(s)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5 text-gold-400" />
                          <span>{t('serviceDeliveryLabel')} {getServiceDelivery(s)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl sm:text-3xl font-black ${isPremium ? 'text-amber-400' : isWhatsApp ? 'text-emerald-400' : 'text-white'}`}>
                          ₹{s.price}
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase">{t('serviceOneTime')}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                      {getServiceDesc(s)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-navy-800 flex items-center justify-between gap-4">
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-xs font-semibold text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      {t('serviceViewDetails')}
                    </Link>
                    {isPremium ? (
                      <button
                        type="button"
                        onClick={() => setCareDrawerOpen(true)}
                        className="py-2.5 px-5 rounded-xl bg-navy-800 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-navy-750 flex items-center gap-1.5 transition-all"
                      >
                        <span>{t('tier499Badge')} • {language === 'hi' ? 'विवरण' : 'Info'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href={`/checkout/${s.slug}`}
                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all"
                      >
                        <span>{t('serviceGetAnalysis')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Care Support Drawer */}
      <CustomerCareDrawer isOpen={careDrawerOpen} onClose={() => setCareDrawerOpen(false)} />

      {/* 4. SAMPLE REPORT DEMO */}
      <section className="py-16 bg-navy-900/40 border-y border-navy-800 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              {t('sampleBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
              {t('sampleTitle')}
            </h2>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-navy-800 border border-gold-500/30 text-gold-300 text-[11px] font-semibold">
              {t('sampleDisclaimer')}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col items-center">
              <VedicChartSvg chartData={sampleDemoChart} />
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-300">
                <span className="px-2.5 py-1 rounded-lg bg-navy-800 border border-navy-700">
                  {language === 'hi' ? 'लग्न: ' : 'Lagna: '}<strong className="text-gold-400">{language === 'hi' ? 'वृश्चिक' : 'Scorpio'}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-navy-800 border border-navy-700">
                  {language === 'hi' ? 'चंद्र: ' : 'Moon: '}<strong className="text-gold-400">{language === 'hi' ? 'वृषभ' : 'Taurus'}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-navy-800 border border-navy-700">
                  {language === 'hi' ? 'नक्षत्र: ' : 'Nakshatra: '}<strong className="text-gold-400">{language === 'hi' ? 'रोहिणी' : 'Rohini'}</strong>
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 shadow">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                  <Star className="w-4 h-4" />
                  <span>{t('samplePersonalityTitle')}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {t('samplePersonalityText')}
                </p>
              </div>

              <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 shadow">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                  <Zap className="w-4 h-4" />
                  <span>{t('sampleCareerTitle')}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {t('sampleCareerText')}
                </p>
              </div>

              <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 shadow">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('sampleRecommendationsTitle')}</span>
                </div>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  <li>{t('sampleRec1')}</li>
                  <li>{t('sampleRec2')}</li>
                  <li>{t('sampleRec3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST SECTION */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              {t('trustBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
              {t('trustTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
              <Lock className="w-6 h-6 text-gold-400 mb-3" />
              <h3 className="text-base font-bold text-white mb-1.5 font-heading">
                {t('trust1Title')}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('trust1Desc')}
              </p>
            </div>

            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
              <ShieldCheck className="w-6 h-6 text-gold-400 mb-3" />
              <h3 className="text-base font-bold text-white mb-1.5 font-heading">
                {t('trust2Title')}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('trust2Desc')}
              </p>
            </div>

            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
              <MessageSquare className="w-6 h-6 text-gold-400 mb-3" />
              <h3 className="text-base font-bold text-white mb-1.5 font-heading">
                {t('trust3Title')}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('trust3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 bg-navy-900/60 border-t border-navy-800 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              {t('faqBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
              {t('faqTitle')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-navy-950/80 border border-navy-800 rounded-2xl p-5 open:border-gold-500/40 transition-colors">
                <summary className="font-bold text-sm text-white flex items-center justify-between cursor-pointer list-none">
                  <span>{faq.q}</span>
                  <span className="text-gold-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-xs text-gray-300 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CONVERSION CTA */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-navy-900 to-navy-950 border border-gold-500/40 rounded-3xl p-8 sm:p-12 shadow-gold-glow-lg">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 font-heading">
            {t('ctaTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 max-w-lg mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link
            href={`/checkout/${primaryService.slug}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all"
          >
            <span>{t('ctaButton')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
