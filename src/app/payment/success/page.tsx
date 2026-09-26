'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Sparkles, MessageSquare, FileText, Bot, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

import CountdownReportTimer from '@/components/report/CountdownReportTimer';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRedirectSeconds, setAutoRedirectSeconds] = useState<number | null>(4);

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';

  useEffect(() => {
    if (orderId) {
      fetch(`/api/customer/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) {
            setOrder(data.order);
            // Automatically open WhatsApp chat when ₹149 service is selected and payment is verified
            if (data.order.service?.price === 149 || data.order.service?.slug === 'vedic-kundli-whatsapp') {
              const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                language === 'hi'
                  ? `नमस्ते AstroVeda, मैंने ₹149 का वैदिक कुंडली + व्हाट्सएप परामर्श (ऑर्डर #${data.order.orderNumber}) का भुगतान सफलतापूर्वक पूरा किया है। कृपया मेरी कुंडली का विश्लेषण आरंभ करें।`
                  : `Hello AstroVeda, I have completed payment for my ₹149 Vedic Kundli + WhatsApp consultation (Order #${data.order.orderNumber}). Please initiate my consultation.`
              )}`;
              setTimeout(() => {
                window.open(waUrl, '_blank');
              }, 1200);
            }
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId, whatsappPhone, language]);

  // Countdown timer for automatic redirect to personalized AI Chat
  useEffect(() => {
    if (autoRedirectSeconds === null || !orderId) return;

    if (autoRedirectSeconds <= 0) {
      router.push(`/consultation/ai-chat?orderId=${orderId}`);
      return;
    }

    const timer = setTimeout(() => {
      setAutoRedirectSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoRedirectSeconds, orderId, router]);

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    language === 'hi'
      ? `नमस्ते AstroVeda, मैंने अभी ऑर्डर #${order?.orderNumber || orderId} का भुगतान पूरा किया है।`
      : `Hello AstroVeda, I just completed payment for Order #${order?.orderNumber || orderId}.`
  )}`;

  const isWhatsAppTier = order?.service?.price === 149 || order?.service?.slug === 'vedic-kundli-whatsapp';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Payment Confirmation Card */}
        <div className="bg-navy-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-gold-glow-lg">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            {t('paySuccessBadge')}
          </span>

          <h1 className="text-2xl font-black text-white mt-1 mb-2 font-heading">
            {t('paySuccessTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
            {t('paySuccessDesc')}
          </p>

          {/* AI Astrologer Live Chat Card (Post-Payment Feature) */}
          {orderId && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-amber-500/20 to-gold-500/15 border border-gold-400/60 text-left space-y-3 shadow-gold-glow animate-luxury-glow">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-gold-300 uppercase tracking-widest font-heading">
                  <Sparkles className="w-4 h-4 text-gold-400 animate-spin-slow" />
                  {language === 'hi' ? '🌟 व्यक्तिगत AI ज्योतिषी तैयार है' : '🌟 Personalized AI Astrologer Ready'}
                </span>
                {autoRedirectSeconds !== null && autoRedirectSeconds > 0 && (
                  <span className="text-[11px] font-mono text-gold-300 bg-navy-950/80 px-2 py-0.5 rounded-full border border-gold-500/30">
                    {language === 'hi' ? `${autoRedirectSeconds}s में रिडायरेक्ट...` : `Redirecting in ${autoRedirectSeconds}s...`}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-200 leading-relaxed">
                {language === 'hi'
                  ? 'आचार्य AstroVeda आपकी जन्म कुंडली का अध्ययन कर चुके हैं। अब आप अपने करियर, विवाह, धन या ग्रह शांति से जुड़े प्रश्न सीधे पूछ सकते हैं!'
                  : 'Acharya AstroVeda is online with your Vedic birth chart loaded. Ask any question about your career, love life, finances, or remedies!'}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Link
                  href={`/consultation/ai-chat?orderId=${orderId}`}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-xs sm:text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>{language === 'hi' ? 'अपने AI ज्योतिषी से लाइव चैट करें' : 'Start Live AI Astrologer Chat'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {autoRedirectSeconds !== null && (
                  <button
                    onClick={() => setAutoRedirectSeconds(null)}
                    className="px-3 py-2 rounded-xl bg-navy-950/60 hover:bg-navy-950 text-gray-400 hover:text-white text-[11px] font-semibold transition-all border border-navy-700"
                  >
                    {language === 'hi' ? 'यहीं रुकें' : 'Stay Here'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ₹149 WhatsApp Active Alert */}
          {isWhatsAppTier && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-left flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold">
                  {language === 'hi' ? 'व्हाट्सएप परामर्श सक्रिय!' : 'WhatsApp Live Chat Activated!'}
                </strong>
                <p className="mt-0.5 text-gray-300 text-[11px] leading-relaxed">
                  {language === 'hi'
                    ? 'आपका ₹149 का परामर्श सत्यापित हो चुका है। व्हाट्सएप चैट स्वतः खुल रही है या आप नीचे दिए हरे बटन पर क्लिक कर सकते हैं।'
                    : 'Your ₹149 consultation is verified. WhatsApp chat is opening automatically, or tap the button below.'}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-navy-950 font-bold text-[11px] hover:bg-emerald-400 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'व्हाट्सएप चैट खोलें' : 'Open WhatsApp Chat'}</span>
                </a>
              </div>
            </div>
          )}

          {order && (
            <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{language === 'hi' ? 'ऑर्डर संख्या:' : 'Order Number:'}</span>
                <strong className="text-white font-mono">{order.orderNumber}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{t('summaryService')}</span>
                <strong className="text-white font-heading">{order.service.name}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{language === 'hi' ? 'राशि:' : 'Amount:'}</span>
                <strong className="text-gold-400 font-bold">₹{order.service.price}</strong>
              </div>
            </div>
          )}

          {/* Requirement 11: 30-Minute Live Countdown Timer */}
          {order && (
            <div className="my-6">
              <CountdownReportTimer
                createdAt={order.createdAt}
                orderNumber={order.orderNumber}
                onComplete={() => {}}
              />
            </div>
          )}

          <div className="space-y-3 pt-2">
            {orderId && (
              <Link
                href={`/dashboard/orders/${orderId}`}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>{t('viewReportBtn')}</span>
              </Link>
            )}

            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-xl bg-navy-800 border border-navy-700 hover:bg-navy-700 text-gray-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <span>{t('dashboardBtn')}</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('whatsappHelpBtn')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-400 border-t-transparent" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
