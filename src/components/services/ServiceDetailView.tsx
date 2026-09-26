'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { HINDI_SERVICES } from '@/lib/i18n/translations';
import { Sparkles, Clock, ArrowRight, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  deliveryTime: string;
}

export default function ServiceDetailView({ service }: { service: ServiceItem }) {
  const { t, language } = useLanguage();

  const serviceName =
    language === 'hi' && HINDI_SERVICES[service.slug]
      ? HINDI_SERVICES[service.slug].name
      : service.name;

  const serviceDesc =
    language === 'hi' && HINDI_SERVICES[service.slug]
      ? HINDI_SERVICES[service.slug].description
      : service.description;

  const serviceDelivery =
    language === 'hi' && HINDI_SERVICES[service.slug]
      ? HINDI_SERVICES[service.slug].deliveryTime
      : service.deliveryTime;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-gold-400 font-medium">
          {t('serviceDetailBreadcrumbHome')}
        </Link>
        <span>/</span>
        <Link href="/services" className="hover:text-gold-400 font-medium">
          {t('serviceDetailBreadcrumbServices')}
        </Link>
        <span>/</span>
        <span className="text-gray-200">{serviceName}</span>
      </div>

      <div className="bg-navy-900 border border-navy-700/80 rounded-3xl p-6 sm:p-10 shadow-xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('servicesBadge')}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading">
            {serviceName}
          </h1>
          <div className="flex flex-col sm:items-end">
            <div className="text-3xl font-black text-gold-400">₹{service.price}</div>
            <span className="text-[11px] text-gray-400">{t('serviceOneTime')}</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8">
          {serviceDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-navy-800 mb-8">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
            <Clock className="w-5 h-5 text-gold-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">{t('serviceDeliveryLabel')}</div>
              <div className="text-xs text-gray-400">{serviceDelivery}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
            <Lock className="w-5 h-5 text-gold-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">{t('confidentialityGuarantee')}</div>
              <div className="text-xs text-gray-400">{t('privateBirthDetails')}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            {t('serviceIncludesHeading')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('serviceInc1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('serviceInc2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('serviceInc3')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('serviceInc4')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('serviceInc5')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('serviceInc6')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={`/checkout/${service.slug}`}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>
              {t('proceedToBirthDetails')} (₹{service.price})
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-navy-800 hover:bg-navy-750 text-gray-300 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('serviceDetailBreadcrumbServices')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
