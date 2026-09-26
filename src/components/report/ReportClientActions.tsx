'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { Printer, Share2, Check, MessageSquare, Download, X, Globe, Sparkles } from 'lucide-react';

interface ReportClientActionsProps {
  title: string;
  orderNumber: string;
  currentLang: 'hi' | 'en';
  onSelectLanguageAndDownload: (lang: 'hi' | 'en') => void;
}

export default function ReportClientActions({
  title,
  orderNumber,
  currentLang,
  onSelectLanguageAndDownload,
}: ReportClientActionsProps) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const handleDownloadClick = () => {
    setIsLangModalOpen(true);
  };

  const handleSelectLanguage = (lang: 'hi' | 'en') => {
    setIsLangModalOpen(false);
    onSelectLanguageAndDownload(lang);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text:
            language === 'hi'
              ? `AstroVeda (एस्ट्रोवेदा) पर मेरी व्यक्तिगत वैदिक ज्योतिष परामर्श रिपोर्ट (#${orderNumber})`
              : `My personalized Vedic astrology consultation report (#${orderNumber}) on AstroVeda.`,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // User cancelled share
      }
    }

    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    language === 'hi'
      ? `नमस्ते AstroVeda, मुझे अपने ऑर्डर #${orderNumber} की रिपोर्ट के संबंध में सहायता चाहिए।`
      : `Hello AstroVeda, I have a question about my report for Order #${orderNumber}.`
  )}`;

  return (
    <>
      <div className="flex items-center gap-2 no-print">
        {/* Primary Download Report Button with Dedicated Language Selection Modal */}
        <button
          onClick={handleDownloadClick}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow transition-all active:scale-[0.98]"
          title="Download report in Hindi or English"
        >
          <Download className="w-3.5 h-3.5 text-navy-950" />
          <span className="hidden sm:inline">
            {language === 'hi' ? 'डाउनलोड रिपोर्ट (PDF)' : 'Download Report (PDF)'}
          </span>
          <span className="sm:hidden">PDF</span>
        </button>

        {/* Print Button also triggers Language Dialog */}
        <button
          onClick={handleDownloadClick}
          className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-navy-900 border border-navy-700 hover:border-gold-500/40 text-xs font-semibold text-gray-200 transition-colors"
          title="Print or Save as PDF"
        >
          <Printer className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden sm:inline">{t('printPdfBtn')}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-gold-500/40 text-xs font-semibold text-gray-200 transition-colors"
          title="Share Report"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">{t('copiedText')}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-gold-400" />
              <span>{t('shareBtn')}</span>
            </>
          )}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
          title="WhatsApp Support"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('whatsappSupport')}</span>
        </a>
      </div>

      {/* DEDICATED LANGUAGE SELECTION MODAL ON DOWNLOAD REPORT */}
      {isLangModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200 no-print"
        >
          <div className="bg-navy-900 border-2 border-gold-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-left relative">
            <button
              onClick={() => setIsLangModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-sm">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                  {language === 'hi' ? 'पीडीएफ डाउनलोड विकल्प' : 'PDF Download Options'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                  {language === 'hi'
                    ? 'रिपोर्ट की भाषा चुनें'
                    : 'Select Report Language'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {language === 'hi'
                ? 'आप अपनी व्यक्तिगत वैदिक कुंडली रिपोर्ट किस भाषा में डाउनलोड या प्रिंट करना चाहते हैं?'
                : 'Which language would you like your personalized Vedic horoscope report to be downloaded in?'}
            </p>

            <div className="space-y-3">
              {/* Option 1: Hindi Edition */}
              <button
                type="button"
                onClick={() => handleSelectLanguage('hi')}
                className={`w-full p-4 rounded-2xl border text-left transition-all group flex items-center justify-between gap-3 ${
                  currentLang === 'hi'
                    ? 'bg-gold-500/15 border-gold-500 shadow-gold-glow'
                    : 'bg-navy-950/80 border-navy-700 hover:border-gold-500/40 hover:bg-navy-850'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇮🇳</span>
                    <span className="font-bold text-white text-sm font-heading group-hover:text-gold-300">
                      हिन्दी संस्करण (Hindi Edition)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500 text-navy-950 font-bold">
                      अनुशंसित
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-normal pl-7">
                    सभी १० खंड, ग्रह स्थिति, दशा समय-सारणी एवं सिद्ध उपाय शुद्ध देवनागरी हिन्दी में।
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shrink-0 font-bold shadow">
                  <Download className="w-4 h-4" />
                </div>
              </button>

              {/* Option 2: English Edition */}
              <button
                type="button"
                onClick={() => handleSelectLanguage('en')}
                className={`w-full p-4 rounded-2xl border text-left transition-all group flex items-center justify-between gap-3 ${
                  currentLang === 'en'
                    ? 'bg-gold-500/15 border-gold-500 shadow-gold-glow'
                    : 'bg-navy-950/80 border-navy-700 hover:border-gold-500/40 hover:bg-navy-850'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇬🇧</span>
                    <span className="font-bold text-white text-sm font-heading group-hover:text-gold-300">
                      English Edition
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-normal pl-7">
                    Complete 10-section Vedic horoscope analysis, planetary placements, and remedial guide in English.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-navy-800 border border-navy-700 text-gray-300 group-hover:bg-gold-500 group-hover:text-navy-950 flex items-center justify-center shrink-0 transition-colors">
                  <Download className="w-4 h-4" />
                </div>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                {language === 'hi' ? 'रद्द करें (वापस जाएं)' : 'Cancel (Dismiss)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
