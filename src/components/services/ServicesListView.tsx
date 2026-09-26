'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { HINDI_SERVICES } from '@/lib/i18n/translations';
import { CONSULTATION_CATEGORIES } from '@/lib/constants/categories';
import CustomerCareDrawer from '@/components/customer-care/CustomerCareDrawer';
import { Sparkles, Clock, ArrowRight, Check, Headphones, MessageSquare } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  deliveryTime: string;
}

export default function ServicesListView({ services }: { services: ServiceItem[] }) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [careDrawerOpen, setCareDrawerOpen] = useState(false);

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
  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((s) => {
        const cat = CONSULTATION_CATEGORIES.find((c) => c.id === selectedCategory);
        if (!cat) return true;
        return s.slug === cat.suggestedReportSlug || s.price === 499;
      });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('servicesCatalogBadge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
          {t('servicesCatalogTitle')}
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          {t('servicesCatalogSubtitle')}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
              : 'bg-navy-900 border border-navy-700 text-gray-300 hover:border-gold-500/40'
          }`}
        >
          {language === 'hi' ? 'समस्त ५ रिपोर्ट्स' : 'All 5 Reports'}
        </button>
        {CONSULTATION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                : 'bg-navy-900 border border-navy-700 text-gray-300 hover:border-gold-500/40'
            }`}
          >
            {language === 'hi' ? cat.nameHi : cat.nameEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((s, idx) => {
          const isPremium = s.price === 499 || s.slug === 'premium-master-horoscope';
          const isWhatsApp = s.price === 149 || s.slug === 'vedic-kundli-whatsapp';

          return (
            <div
              key={s.id}
              className={`flex flex-col justify-between bg-navy-900 border rounded-3xl p-6 sm:p-8 relative transition-all hover:scale-[1.01] ${
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
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-xl font-bold text-white tracking-tight font-heading">
                    {getServiceName(s)}
                  </h2>
                  <div className={`text-2xl font-black ${isPremium ? 'text-amber-400' : isWhatsApp ? 'text-emerald-400' : 'text-white'}`}>
                    ₹{s.price}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gold-400 font-semibold mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('serviceDeliveryLabel')} {getServiceDelivery(s)}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  {getServiceDesc(s)}
                </p>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t('serviceFeatureChart')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t('serviceFeatureDasha')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t('serviceFeatureDashboard')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {isWhatsApp
                        ? (language === 'hi' ? 'सक्रिय व्हाट्सएप लाइव परामर्श सम्मिलित' : 'Live WhatsApp astrologer session included')
                        : t('serviceFeatureWhatsApp')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-navy-800 flex items-center justify-between gap-4">
                <Link
                  href={`/services/${s.slug}`}
                  className="text-xs font-semibold text-gray-400 hover:text-white"
                >
                  {t('learnMore')}
                </Link>
                {isPremium ? (
                  <button
                    type="button"
                    onClick={() => setCareDrawerOpen(true)}
                    className="py-3 px-6 rounded-xl bg-navy-800 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-navy-750 flex items-center gap-1.5 transition-all"
                  >
                    <span>{t('tier499Badge')} • {language === 'hi' ? 'विवरण देखें' : 'View Info'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href={`/checkout/${s.slug}`}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all"
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

      <CustomerCareDrawer isOpen={careDrawerOpen} onClose={() => setCareDrawerOpen(false)} />
    </div>
  );
}
