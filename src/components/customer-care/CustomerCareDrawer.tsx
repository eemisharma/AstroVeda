'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { CONSULTATION_CATEGORIES, ProblemCategory } from '@/lib/constants/categories';
import {
  Heart,
  Briefcase,
  Activity,
  Shield,
  X,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Check,
  HelpCircle,
  ShoppingBag,
  Headphones,
} from 'lucide-react';

interface CustomerCareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerCareDrawer({ isOpen, onClose }: CustomerCareDrawerProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory>(CONSULTATION_CATEGORIES[0]);

  if (!isOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Heart':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-amber-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Shield':
      default:
        return <Shield className="w-5 h-5 text-purple-400" />;
    }
  };

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';

  const categoryName = language === 'hi' ? selectedCategory.nameHi : selectedCategory.nameEn;
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    language === 'hi'
      ? `नमस्ते AstroVeda Customer Care, मुझे "${selectedCategory.nameHi}" के संबंध में मार्गदर्शन, सही रिपोर्ट चयन और वैदिक उपाय उत्पादों की जानकारी चाहिए।`
      : `Hello AstroVeda Customer Care, I need guidance regarding "${selectedCategory.nameEn}", choosing the right report and remedial products.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-xl bg-navy-950 border-l border-gold-500/30 h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-gold-glow">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                {t('customerCareBadge')}
              </span>
              <h2 className="text-base sm:text-lg font-black text-white font-heading">
                {t('customerCareTitle')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 sm:p-6 space-y-7 flex-1">
          {/* Introduction Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/15 via-navy-900 to-navy-900 border border-gold-500/30 text-xs text-gray-300">
            <p className="leading-relaxed">
              {t('customerCareSubtitle')}
            </p>
          </div>

          {/* STEP 1: Problem Category Selector */}
          <div>
            <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-heading">
              <span>{t('stepSelectConcern')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CONSULTATION_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                    className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-gold-500/15 border-gold-500 shadow-gold-glow ring-1 ring-gold-400'
                        : 'bg-navy-900/80 border-navy-800 hover:border-navy-700 text-gray-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getIcon(cat.iconName)}</div>
                    <div>
                      <div className="text-xs font-bold text-white font-heading">
                        {language === 'hi' ? cat.nameHi : cat.nameEn}
                      </div>
                      <div className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 leading-snug">
                        {language === 'hi' ? cat.subtitleHi : cat.subtitleEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Recommended Report Tier */}
          <div className="p-5 rounded-2xl bg-navy-900 border border-gold-500/40 space-y-3 shadow-gold-glow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5 font-heading">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('stepSuggestedReport')}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold-500 text-navy-950">
                {selectedCategory.suggestedReportSlug === 'vedic-kundli-whatsapp' ? '₹149 + WhatsApp' : '₹99 Best Value'}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white font-heading">
                {selectedCategory.suggestedReportSlug === 'vedic-kundli-whatsapp'
                  ? (language === 'hi' ? 'विस्तृत वैदिक कुंडली + सीधा व्हाट्सएप परामर्श' : 'Deep Vedic Kundli + Live WhatsApp Consultation')
                  : (language === 'hi' ? 'संपूर्ण जीवन व भाग्य मार्गदर्शन' : 'Comprehensive Destiny & House Analysis')}
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {selectedCategory.suggestedReportSlug === 'vedic-kundli-whatsapp'
                  ? (language === 'hi'
                      ? 'इस समस्या के लिए व्यक्तिगत १०-खंडीय रिपोर्ट के साथ ज्योतिषी से सीधा व्हाट्सएप चैट परामर्श सर्वोत्तम है।'
                      : 'Recommended for your concern: In-depth 10-section report combined with direct live WhatsApp astrologer consultation.')
                  : (language === 'hi'
                      ? 'गहन १२ भावों का विश्लेषण, ग्रह दशा, धन योग और आने वाले २ वर्षों का सटीक मार्गदर्शन।'
                      : 'Complete 12-house reading, planetary periods, wealth yogas, and actionable 2-year forecast.')}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href={`/checkout/${selectedCategory.suggestedReportSlug}`}
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{t('getRecommendedReport')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* STEP 3: Suggested Consecrated Vedic Products & Remedies */}
          <div>
            <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-heading">
              <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
              <span>{t('stepSuggestedProducts')}</span>
            </h3>

            <div className="space-y-3">
              {selectedCategory.suggestedProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-navy-900/90 border border-navy-800 hover:border-gold-500/30 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        {language === 'hi' ? prod.badgeHi : prod.badgeEn}
                      </span>
                      <h5 className="text-sm font-bold text-white font-heading mt-1">
                        {language === 'hi' ? prod.nameHi : prod.nameEn}
                      </h5>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gold-400">₹{prod.price}</div>
                      <span className="text-[10px] text-gray-500">वैदिक सिद्ध</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {language === 'hi' ? prod.descriptionHi : prod.descriptionEn}
                  </p>

                  <div className="space-y-1">
                    {(language === 'hi' ? prod.benefitsHi : prod.benefitsEn).map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      {language === 'hi' ? 'मंत्रों द्वारा प्राण-प्रतिष्ठित' : 'Pran-Pratishtha Consecrated'}
                    </span>
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        language === 'hi'
                          ? `नमस्ते AstroVeda, मुझे "${prod.nameHi}" (₹${prod.price}) के बारे में जानना है और इसे मंगाना है।`
                          : `Hello AstroVeda, I want to inquire about and order "${prod.nameEn}" (₹${prod.price}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'व्हाट्सएप पर ऑर्डर करें' : 'Order via WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer WhatsApp Action */}
        <div className="sticky bottom-0 z-20 bg-navy-900/95 backdrop-blur-md border-t border-navy-800 p-4 sm:p-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('customerCareCta')}</span>
          </a>
          <p className="text-[10px] text-center text-gray-400 mt-2">
            {t('customerCareNote')}
          </p>
        </div>
      </div>
    </div>
  );
}
