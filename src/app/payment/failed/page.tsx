'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const errorMsg =
    searchParams.get('error') ||
    (language === 'hi'
      ? 'आपका भुगतान पूरा नहीं हो सका। कृपया पुनः प्रयास करें।'
      : 'Your payment could not be completed. Please try again.');

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    language === 'hi'
      ? 'नमस्ते एस्ट्रोकंसल्ट, मेरा भुगतान विफल हो गया है और मुझे सहायता चाहिए।'
      : 'Hello AstroConsult, my payment failed and I need help with my astrology consultation.'
  )}`;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
          {t('payFailedBadge')}
        </span>

        <h1 className="text-2xl font-black text-white mt-1 mb-3 font-heading">
          {t('payFailedTitle')}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
          {errorMsg}
        </p>

        <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-4 text-xs text-gray-400 mb-6 text-left">
          <p className="font-semibold text-gray-300 mb-1">
            {language === 'hi' ? 'ऐसा क्यों हो सकता है?' : 'Why did this happen?'}
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px]">
            <li>{language === 'hi' ? 'बैंक ओटीपी समय सीमा समाप्त या सर्वर विलंब।' : 'Bank OTP timeout or server delay.'}</li>
            <li>{language === 'hi' ? 'कार्ड सीमा या बैंक सुरक्षा प्रतिबंध।' : 'Insufficient limit or card security restriction.'}</li>
            <li>{language === 'hi' ? 'यूपीआई सत्यापन के दौरान नेटवर्क कनेक्शन में रुकावट।' : 'UPI app connection dropped during authorization.'}</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/services"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('retryBtn')}</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors hover:bg-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('whatsappHelpBtn')}</span>
          </a>

          <Link
            href="/"
            className="w-full py-2.5 text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('returnHomeBtn')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-400 border-t-transparent" /></div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
