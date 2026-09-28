'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  Sparkles,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Zap,
  Heart,
  Coins,
  Shield,
  Bot,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import VedicChartSvg from '@/components/kundli/VedicChartSvg';
import { ChartData } from '@/lib/astrology/types';
import { AstrologyReportContent } from '@/lib/ai/types';
import {
  generateHindiReportContent,
  getHindiSign,
  getHindiPlanet,
} from '@/lib/ai/hindi-report';
import ReportClientActions from '@/components/report/ReportClientActions';
import CountdownReportTimer from '@/components/report/CountdownReportTimer';
import { calculateVedicBirthChart } from '@/lib/astrology/vedic-calculator';

interface OrderDetailReportViewProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string | Date;
    user: {
      name: string;
    };
    service: {
      name: string;
      slug: string;
      price?: number;
    };
    birthProfile: {
      dateOfBirth: string;
      timeOfBirth: string;
      birthCity: string;
    };
    report?: {
      title?: string | null;
    } | null;
  };
  chartData: ChartData | null;
  reportContent: AstrologyReportContent | null;
}

export default function OrderDetailReportView({
  order,
  chartData,
  reportContent,
}: OrderDetailReportViewProps) {
  const { t, language } = useLanguage();
  const [reportLang, setReportLang] = useState<'hi' | 'en'>(language);

  const [effectiveOrder, setEffectiveOrder] = useState(order);
  const [effectiveChartData, setEffectiveChartData] = useState<ChartData | null>(chartData);

  const [timerComplete, setTimerComplete] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isBypassed =
        localStorage.getItem(`astroveda_timer_bypassed_${order.orderNumber}`) === 'true' ||
        localStorage.getItem(`astroveda_timer_bypassed_${order.id}`) === 'true';
      if (isBypassed || order.status === 'DELIVERED') return true;

      const startStr =
        localStorage.getItem(`astroveda_timer_start_${order.orderNumber}`) ||
        localStorage.getItem(`astroveda_timer_start_${order.id}`);
      const startTime = startStr ? parseInt(startStr, 10) : new Date(order.createdAt).getTime();
      const elapsedMinutes = !isNaN(startTime) ? (Date.now() - startTime) / (1000 * 60) : 0;
      if (elapsedMinutes >= 30) return true;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check persistent bypass / elapsed time
    const isBypassed =
      localStorage.getItem(`astroveda_timer_bypassed_${order.orderNumber}`) === 'true' ||
      localStorage.getItem(`astroveda_timer_bypassed_${order.id}`) === 'true';

    const startStr =
      localStorage.getItem(`astroveda_timer_start_${order.orderNumber}`) ||
      localStorage.getItem(`astroveda_timer_start_${order.id}`);

    const startTime = startStr ? parseInt(startStr, 10) : new Date(order.createdAt).getTime();
    const elapsedMinutes = !isNaN(startTime) ? (Date.now() - startTime) / (1000 * 60) : 0;

    if (isBypassed || elapsedMinutes >= 30 || order.status === 'DELIVERED') {
      setTimerComplete(true);
    }

    // Reconcile user-entered birth data from local storage so fed data is never changed
    try {
      const stored = localStorage.getItem('astroveda_customer_orders');
      if (stored) {
        const localOrders = JSON.parse(stored);
        const match = localOrders.find((o: any) => o.id === order.id || o.orderNumber === order.orderNumber);
        if (match && match.birthProfile) {
          setEffectiveOrder((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              name: match.user?.name || match.birthProfile?.fullName || prev.user?.name,
            },
            birthProfile: {
              ...prev.birthProfile,
              dateOfBirth: match.birthProfile.dateOfBirth || prev.birthProfile.dateOfBirth,
              timeOfBirth: match.birthProfile.timeOfBirth || prev.birthProfile.timeOfBirth,
              birthCity: match.birthProfile.birthCity || prev.birthProfile.birthCity,
            },
          }));

          // Re-calculate live chart if needed
          if (!chartData || (match.birthProfile.birthCity && match.birthProfile.birthCity !== order.birthProfile?.birthCity)) {
            try {
              const freshChart = calculateVedicBirthChart({
                dateOfBirth: match.birthProfile.dateOfBirth || order.birthProfile?.dateOfBirth,
                timeOfBirth: match.birthProfile.timeOfBirth || order.birthProfile?.timeOfBirth,
                birthCity: match.birthProfile.birthCity || order.birthProfile?.birthCity,
              });
              setEffectiveChartData(freshChart);
            } catch (err) {
              console.warn('Chart calculation error in view:', err);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Reconciliation error in OrderDetailReportView:', e);
    }
  }, [order.id, order.orderNumber, order.createdAt, order.status, chartData, order.birthProfile?.birthCity]);

  const isReady = timerComplete;

  const handleNavigateToLiveChat = () => {
    // Navigate to live consultation smoothly without resetting the report timer
  };

  const getStatusDisplay = (status: string) => {
    if (language === 'hi') {
      switch (status) {
        case 'PAID':
        case 'PROCESSING':
          return 'वैदिक गणना जारी (30 मिनट)';
        case 'ANALYSIS_READY':
        case 'DELIVERED':
          return 'रिपोर्ट तैयार';
        default:
          return status;
      }
    }
    return status;
  };

  // Requirement 1 & 8: Active content resolution in pure Hindi or English
  const activeContent = (() => {
    if (!reportContent) return null;
    const resolvedChart = effectiveChartData || chartData;
    if (reportLang === 'hi') {
      if (reportContent.hi) {
        return reportContent.hi;
      }
      if (resolvedChart) {
        return generateHindiReportContent({
          customerName: effectiveOrder.user.name,
          serviceName: effectiveOrder.service.name,
          chartData: resolvedChart,
        });
      }
    }
    return reportContent;
  })();

  const sectionTitles = {
    hi: {
      sec1: '1. वैदिक सारांश एवं समग्र दृष्टि',
      sec2: '2. व्यक्तित्व एवं आंतरिक आत्मबल',
      sec3: '3. आजीविका, व्यवसाय एवं कर्मक्षेत्र',
      sec4: '4. धन, समृद्धि एवं आर्थिक योग',
      sec5: '5. प्रेम, विवाह एवं संबंध योग',
      sec6: '6. प्राकृतिक प्रतिभाएं एवं ग्रह बल',
      sec7: '7. संभावित बाधाएं एवं चुनौतियां',
      sec8: '8. महत्वपूर्ण दशा कालखंड एवं गोचर',
      sec9: '9. सिद्ध वैदिक उपाय एवं मार्गदर्शन',
      sec10: '10. वैदिक ज्योतिषीय परामर्श अस्वीकरण',
    },
    en: {
      sec1: '1. Executive Astrological Summary',
      sec2: '2. Core Personality & Temperament',
      sec3: '3. Career & Professional Calling',
      sec4: '4. Financial Outlook & Wealth Yoga',
      sec5: '5. Love, Marriage & Relationships',
      sec6: '6. Key Astrological Strengths & Assets',
      sec7: '7. Potential Vulnerabilities & Challenges',
      sec8: '8. Critical Planetary Timelines & Dasha',
      sec9: '9. Consecrated Vedic Remedies & Countermeasures',
      sec10: '10. Astrological Consultation Disclaimer',
    },
  };

  const handleSelectLanguageAndDownload = (selectedLang: 'hi' | 'en') => {
    setReportLang(selectedLang);
    // Update document title for clean PDF filename
    const originalTitle = document.title;
    document.title = `AstroVeda_${selectedLang === 'hi' ? 'Kundli_Report_Hindi' : 'Kundli_Report_English'}_${order.orderNumber}`;

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 250);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 print:space-y-4 print:pb-0 print:max-w-full">
      {/* Printable Header Banner (Only visible in PDF / Print) */}
      <div className="hidden print:flex items-center justify-between pb-3 mb-4 border-b-2 border-amber-900/40">
        <div>
          <span className="text-xl font-black text-amber-950 tracking-tight font-heading block">
            AstroVeda • एस्ट्रोवेदा
          </span>
          <span className="text-[10px] text-gray-600 font-medium">
            {reportLang === 'hi'
              ? 'प्रामाणिक वैदिक ज्योतिष परामर्श • सम्पूर्ण जन्म पत्रिका'
              : 'Authentic Vedic Astrology Consultation • Complete Birth Chart'}
          </span>
        </div>
        <div className="text-right text-[10px] text-gray-700 font-mono">
          <div>#{order.orderNumber}</div>
          <div>www.astroveda.com</div>
        </div>
      </div>

      {/* Top Breadcrumb & Action Bar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToDashboard')}</span>
        </Link>

        {/* Bilingual Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-900 border border-navy-700">
            <button
              type="button"
              onClick={() => setReportLang('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reportLang === 'hi'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🇮🇳 हिन्दी में पढ़ें
            </button>
            <button
              type="button"
              onClick={() => setReportLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reportLang === 'en'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🇬🇧 Read in English
            </button>
          </div>

          {isReady && reportContent && (
            <ReportClientActions
              title={order.report?.title || order.service.name}
              orderNumber={order.orderNumber}
              currentLang={reportLang}
              onSelectLanguageAndDownload={handleSelectLanguageAndDownload}
            />
          )}
        </div>
      </div>

      {/* Live Astrologer Live Chat Card (Strictly Manual Click Navigation) */}
      <div className="bg-gradient-to-r from-gold-500/15 via-amber-500/20 to-gold-500/15 border border-gold-400/50 rounded-3xl p-5 sm:p-6 text-left space-y-3 shadow-gold-glow no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 via-amber-500 to-gold-600 flex items-center justify-center text-navy-950 font-bold shadow-gold-glow shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                  {language === 'hi' ? 'आचार्य AstroVeda • Chat Live' : 'Acharya AstroVeda • Chat Live'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {language === 'hi' ? 'मैन्युअल चैट' : 'Manual Chat'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                {language === 'hi'
                  ? 'अपनी जन्म पत्रिका से जुड़े व्यक्तिगत प्रश्न पूछने हेतु आचार्य जी से लाइव परामर्श करें।'
                  : 'Start 1-on-1 consultation with Acharya AstroVeda connected to your birth chart.'}
              </p>
            </div>
          </div>

          <Link
            href={`/consultation/ai-chat?orderId=${order.id}`}
            onClick={handleNavigateToLiveChat}
            className="shrink-0 py-2.5 px-5 rounded-xl bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>{language === 'hi' ? 'चैट लाइव शुरू करें' : 'Open Live Chat'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 30-Minute Live Countdown Timer before report unlocks */}
      {!timerComplete && (
        <CountdownReportTimer
          key={order.orderNumber}
          createdAt={order.createdAt}
          orderNumber={order.orderNumber}
          customerName={effectiveOrder.user?.name}
          orderId={order.id}
          onComplete={() => setTimerComplete(true)}
        />
      )}

      {/* Processing State Banner if still generating and timer completed */}
      {timerComplete && !isReady && (
        <div className="bg-navy-900 border border-amber-500/40 rounded-3xl p-8 text-center shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4 animate-pulse">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-heading">
            {t('reportGeneratingTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
            {t('reportGeneratingDesc')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 border border-navy-800 text-xs text-gold-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              #{order.orderNumber} • {t('orderStatusLabel')} {getStatusDisplay(order.status)}
            </span>
          </div>
        </div>
      )}

      {/* Full Report Presentation */}
      {isReady && activeContent && (
        <div className="space-y-8 print:space-y-4">
          {/* Header Card */}
          <div className="bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 border border-gold-500/40 rounded-3xl p-6 sm:p-10 shadow-gold-glow-lg print-card print:p-5 print:rounded-2xl print:border print:border-gray-300 print:bg-white print:break-inside-avoid">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 print:mb-4">
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest print:text-amber-900 print:font-black">
                  {reportLang === 'hi' ? 'प्रामाणिक वैदिक ज्योतिषीय रिपोर्ट' : 'Vedic Astrological Report'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 print-dark-text font-heading print:text-2xl print:text-gray-950">
                  {order.service.name}
                </h1>
                <p className="text-sm text-gray-300 font-medium mt-1 print-dark-text print:text-xs">
                  {reportLang === 'hi' ? 'परामर्श पात्र:' : 'Consultation for:'}{' '}
                  <strong className="text-white print-dark-text">{effectiveOrder.user.name}</strong>
                </p>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-gray-400 print:text-right print:text-[10px]">
                <span className="font-mono text-gold-300 font-bold print:text-amber-900">
                  #{effectiveOrder.orderNumber}
                </span>
                <span className="print-dark-text">
                  {new Date(effectiveOrder.createdAt).toLocaleDateString(
                    reportLang === 'hi' ? 'hi-IN' : 'en-IN',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Birth Details Capsule */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-navy-950/80 border border-navy-800 text-xs print:grid print:grid-cols-4 print:gap-2 print:p-3 print:bg-gray-50 print:border print:border-gray-200 print:rounded-xl">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block print-dark-text">
                  {reportLang === 'hi' ? 'जन्म तिथि' : t('dobLabel')}
                </span>
                <strong className="text-white print-dark-text">{effectiveOrder.birthProfile.dateOfBirth}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block print-dark-text">
                  {reportLang === 'hi' ? 'जन्म समय' : t('tobLabel')}
                </span>
                <strong className="text-white print-dark-text">{effectiveOrder.birthProfile.timeOfBirth}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block print-dark-text">
                  {reportLang === 'hi' ? 'जन्म स्थान' : t('cityLabel')}
                </span>
                <strong className="text-white print-dark-text">{effectiveOrder.birthProfile.birthCity}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block print-dark-text">
                  {reportLang === 'hi' ? 'वर्तमान महादशा' : t('currentMahadashaLabel')}
                </span>
                <strong className="text-gold-400 font-bold print:text-amber-900">
                  {reportLang === 'hi' && (effectiveChartData || chartData)?.dasha?.currentMahadasha
                    ? getHindiPlanet((effectiveChartData || chartData)!.dasha.currentMahadasha)
                    : (effectiveChartData || chartData)?.dasha?.currentMahadasha || 'Active'}
                </strong>
              </div>
            </div>
          </div>

          {/* Kundli Chart Visual & Key Signatures (Strictly Formatted Without Overlap) */}
          {(() => {
            const activeChart = effectiveChartData || chartData;
            if (!activeChart) return null;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 print:grid print:grid-cols-2 gap-6 print:gap-4 items-center print:items-start print:break-inside-avoid print:mb-4">
                {/* Left: Chart SVG */}
                <div className="lg:col-span-6 print:col-span-1 flex justify-center print:block print:w-[300px] print:mx-auto">
                  <VedicChartSvg chartData={activeChart} showTable={false} />
                </div>

                {/* Right: Astrological Signatures & Planetary Table */}
                <div className="lg:col-span-6 print:col-span-1 space-y-3 print:space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 print-dark-text font-heading print:text-amber-950 print:text-xs">
                    {reportLang === 'hi' ? 'प्रमुख ज्योतिषीय हस्ताक्षर' : t('astrologicalSignatures')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 print:gap-2 text-xs">
                    <div className="p-3.5 print:p-2 rounded-xl bg-navy-900 border border-navy-800 print:bg-white print:border print:border-gray-200 print:rounded-lg">
                      <span className="text-gray-400 text-[11px] block print-dark-text">
                        {reportLang === 'hi' ? 'लग्न (Ascendant)' : t('lagnaLabel')}
                      </span>
                      <strong className="text-white text-sm print-dark-text print:text-xs">
                        {reportLang === 'hi'
                          ? getHindiSign(activeChart.ascendant.sign)
                          : activeChart.ascendant.sign}
                      </strong>
                      <span className="text-[10px] text-gold-400 block mt-0.5 print:text-amber-900">
                        {activeChart.ascendant.degree}° • {activeChart.ascendant.nakshatra}
                      </span>
                    </div>

                    <div className="p-3.5 print:p-2 rounded-xl bg-navy-900 border border-navy-800 print:bg-white print:border print:border-gray-200 print:rounded-lg">
                      <span className="text-gray-400 text-[11px] block print-dark-text">
                        {reportLang === 'hi' ? 'चंद्र राशि (Moon Sign)' : t('moonSignLabel')}
                      </span>
                      <strong className="text-white text-sm print-dark-text print:text-xs">
                        {reportLang === 'hi' ? getHindiSign(activeChart.moonSign) : activeChart.moonSign}
                      </strong>
                      <span className="text-[10px] text-gold-400 block mt-0.5 print:text-amber-900">
                        {reportLang === 'hi' ? 'भावनात्मक स्वरूप' : t('emotionalBlueprint')}
                      </span>
                    </div>

                    <div className="p-3.5 print:p-2 rounded-xl bg-navy-900 border border-navy-800 print:bg-white print:border print:border-gray-200 print:rounded-lg">
                      <span className="text-gray-400 text-[11px] block print-dark-text">
                        {reportLang === 'hi' ? 'जन्म नक्षत्र' : t('nakshatraLabel')}
                      </span>
                      <strong className="text-white text-sm print-dark-text print:text-xs">
                        {activeChart.nakshatra}
                      </strong>
                      <span className="text-[10px] text-gold-400 block mt-0.5 print:text-amber-900">
                        पद {activeChart.nakshatraPada} • स्वामी: {activeChart.nakshatraLord}
                      </span>
                    </div>

                    <div className="p-3.5 print:p-2 rounded-xl bg-navy-900 border border-navy-800 print:bg-white print:border print:border-gray-200 print:rounded-lg">
                      <span className="text-gray-400 text-[11px] block print-dark-text">
                        {reportLang === 'hi' ? 'सूर्य राशि (Sun Sign)' : t('sunSignLabel')}
                      </span>
                      <strong className="text-white text-sm print-dark-text print:text-xs">
                        {reportLang === 'hi' ? getHindiSign(activeChart.sunSign) : activeChart.sunSign}
                      </strong>
                      <span className="text-[10px] text-gold-400 block mt-0.5 print:text-amber-900">
                        {reportLang === 'hi' ? 'आत्मबल एवं ऊर्जा' : t('vitalityPurpose')}
                      </span>
                    </div>
                  </div>

                  {/* Planetary Positions Quick Table */}
                  <div className="mt-4 print:mt-2 p-4 print:p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-xs overflow-x-auto print:bg-white print:border print:border-gray-200 print:rounded-lg">
                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-2 print-dark-text print:text-[10px]">
                      {reportLang === 'hi' ? 'प्रमुख ग्रह स्थिति सारणी' : t('keyPlacementsLabel')}
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 print:grid-cols-4 gap-2 text-[11px] print:text-[10px]">
                      {activeChart.planets.slice(0, 8).map((p) => (
                        <div key={p.name} className="flex flex-col text-gray-300 print-dark-text">
                          <span className="font-semibold text-white print-dark-text">
                            {reportLang === 'hi' ? p.sanskritName || p.name : p.name}
                          </span>
                          <span className="text-[10px] text-gray-400 print:text-gray-600">
                            {reportLang === 'hi' ? `भाव ${p.house}` : `H${p.house}`} ({p.sign.split(' ')[0]})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 10 REPORT SECTIONS */}

          {/* 1. Overview */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-3 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-950">
              <Sparkles className="w-4 h-4 print:text-amber-800" />
              <span>{sectionTitles[reportLang].sec1}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed print-dark-text print:text-xs print:leading-relaxed">
              {activeContent.summary}
            </p>
          </div>

          {/* 2. Personality */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-3 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-950">
              <Star className="w-4 h-4 print:text-amber-800" />
              <span>{sectionTitles[reportLang].sec2}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed print-dark-text print:text-xs print:leading-relaxed">
              {activeContent.personality}
            </p>
          </div>

          {/* 3. Career */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-3 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-950">
              <Zap className="w-4 h-4 print:text-amber-800" />
              <span>{sectionTitles[reportLang].sec3}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed print-dark-text print:text-xs print:leading-relaxed">
              {activeContent.career}
            </p>
          </div>

          {/* 4. Money & Finance */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-3 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-950">
              <Coins className="w-4 h-4 print:text-amber-800" />
              <span>{sectionTitles[reportLang].sec4}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed print-dark-text print:text-xs print:leading-relaxed">
              {activeContent.finance}
            </p>
          </div>

          {/* 5. Love & Relationships */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-3 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-950">
              <Heart className="w-4 h-4 text-pink-400 print:text-rose-700" />
              <span>{sectionTitles[reportLang].sec5}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed print-dark-text print:text-xs print:leading-relaxed">
              {activeContent.relationships}
            </p>
          </div>

          {/* 6. Strengths */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-4 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider font-heading print:text-emerald-800">
              <CheckCircle2 className="w-4 h-4 print:text-emerald-700" />
              <span>{sectionTitles[reportLang].sec6}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid print:grid-cols-2 gap-3 print:gap-2">
              {activeContent.strengths.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 print:p-2.5 rounded-2xl print:rounded-lg bg-navy-950/60 border border-navy-800 print:bg-gray-50 print:border print:border-gray-200 text-xs text-gray-200 leading-relaxed print-dark-text print:text-[11px]"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* 7. Challenges */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-4 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-900">
              <AlertTriangle className="w-4 h-4 print:text-amber-700" />
              <span>{sectionTitles[reportLang].sec7}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid print:grid-cols-2 gap-3 print:gap-2">
              {activeContent.challenges.map((c, idx) => (
                <div
                  key={idx}
                  className="p-3.5 print:p-2.5 rounded-2xl print:rounded-lg bg-navy-950/60 border border-navy-800 print:bg-gray-50 print:border print:border-gray-200 text-xs text-gray-200 leading-relaxed print-dark-text print:text-[11px]"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* 8. Important Periods */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-4 print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-950">
              <Clock className="w-4 h-4 print:text-amber-800" />
              <span>{sectionTitles[reportLang].sec8}</span>
            </div>
            <div className="space-y-2.5 print:space-y-1.5">
              {activeContent.important_periods.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 print:p-2.5 rounded-2xl print:rounded-lg bg-navy-950/60 border border-navy-800 print:bg-gray-50 print:border print:border-gray-200 text-xs text-gray-200 leading-relaxed print-dark-text print:text-[11px]"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* 9. Recommendations / Remedies */}
          <div className="bg-navy-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-gold-glow print-card print:p-5 print:rounded-2xl print:border print:border-gray-200 print:bg-white print:shadow-none print:break-inside-avoid">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-heading print:text-amber-950">
              <Sparkles className="w-4 h-4 print:text-amber-800" />
              <span>{sectionTitles[reportLang].sec9}</span>
            </div>
            <div className="space-y-2.5 print:space-y-1.5">
              {activeContent.recommendations.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 print:p-2.5 rounded-2xl print:rounded-lg bg-navy-950/80 border border-navy-800 print:bg-gray-50 print:border print:border-gray-200 text-xs text-gray-200 leading-relaxed print-dark-text print:text-[11px]"
                >
                  <CheckCircle2 className="w-4 h-4 text-gold-400 print:text-amber-800 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Disclaimer */}
          <div className="bg-navy-950 border border-navy-800 rounded-3xl p-6 print:p-4 text-xs text-gray-400 leading-relaxed print-card print:bg-gray-50 print:border print:border-gray-200 print:break-inside-avoid">
            <div className="flex items-center gap-2 font-bold text-gray-300 uppercase tracking-wider mb-2 print-dark-text font-heading print:text-gray-900">
              <Shield className="w-3.5 h-3.5 text-gold-400 print:text-amber-800" />
              <span>{sectionTitles[reportLang].sec10}</span>
            </div>
            <p className="print-dark-text print:text-[10px]">{activeContent.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
