'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileText,
  Compass,
  Bot,
  MessageSquare,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  amount: number;
  createdAt: string | Date;
  service: {
    name: string;
    slug: string;
  };
  report?: {
    id?: string;
  } | null;
}

interface DashboardOverviewClientProps {
  orders: OrderItem[];
}

export default function DashboardOverviewClient({ orders }: DashboardOverviewClientProps) {
  const { t, language } = useLanguage();
  const [allOrders, setAllOrders] = useState<OrderItem[]>(orders);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('astroveda_customer_orders');
      if (stored) {
        const localOrders: OrderItem[] = JSON.parse(stored);
        if (Array.isArray(localOrders) && localOrders.length > 0) {
          setAllOrders((prev) => {
            const existingIds = new Set(prev.map((o) => o.id));
            const existingNums = new Set(prev.map((o) => o.orderNumber));
            const additions = localOrders.filter(
              (lo) => lo && !existingIds.has(lo.id) && !existingNums.has(lo.orderNumber)
            );
            return [...prev, ...additions];
          });

          // Background sync local orders to user's account in database
          fetch('/api/customer/sync-orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orders: localOrders }),
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Failed to merge local customer orders:', e);
    }
  }, [orders]);

  const activeOrders = allOrders.filter(
    (o) => o.status === 'PROCESSING' || o.status === 'PAID'
  );
  const readyReports = allOrders.filter(
    (o) => o.status === 'ANALYSIS_READY' || o.status === 'DELIVERED'
  );

  const formatNumber = (num: number) => {
    return String(num);
  };

  const getStatusDisplay = (status: string) => {
    if (language === 'hi') {
      switch (status) {
        case 'PAID':
        case 'PROCESSING':
          return 'प्रक्रियाधीन';
        case 'ANALYSIS_READY':
        case 'DELIVERED':
          return 'सक्रिय / तैयार';
        default:
          return status;
      }
    }
    return status;
  };

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>{t('kpiTotal')}</span>
            <Sparkles className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {formatNumber(allOrders.length)}
          </div>
        </div>

        <div className="bg-navy-900 border border-gold-500/30 rounded-2xl p-5 shadow-gold-glow">
          <div className="flex items-center justify-between text-gold-400 text-xs mb-2">
            <span>{t('kpiReady')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {formatNumber(readyReports.length)}
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>{t('kpiProcessing')}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {formatNumber(activeOrders.length)}
          </div>
        </div>
      </div>

      {/* Recent / Active Orders with Separate Service Access */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight font-heading">
            {t('myConsultationsTitle')}
          </h2>
          {allOrders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="text-xs text-gold-400 hover:underline font-semibold"
            >
              {t('viewAllBtn')}
            </Link>
          )}
        </div>

        {allOrders.length === 0 ? (
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 font-heading">
              {t('noOrdersYet')}
            </h3>
            <p className="text-xs text-gray-400 mb-5 max-w-sm mx-auto">
              {t('noOrdersDesc')}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow transition-all"
            >
              <span>{t('exploreServicesBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {allOrders.map((order) => {
              const isReady =
                order.status === 'ANALYSIS_READY' || order.status === 'DELIVERED';
              const slug = order.service?.slug || '';
              const isChatTier =
                slug === 'chat-live' ||
                slug === 'ai-chat' ||
                slug === 'comprehensive-destiny' ||
                order.amount === 99;
              const isWhatsAppTier =
                slug === 'vedic-kundli-whatsapp' || order.amount === 149;
              const isReportOnlyTier =
                slug === 'quick-kundli-glance' ||
                slug === 'life-direction-transit' ||
                order.amount === 49 ||
                order.amount === 89;

              const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                language === 'hi'
                  ? `नमस्ते AstroVeda, मेरे ऑर्डर #${order.orderNumber} (₹149 व्हाट्सएप परामर्श) के तहत ज्योतिषीय परामर्श आरंभ करें।`
                  : `Hello AstroVeda, I would like to initiate my consultation for Order #${order.orderNumber}.`
              )}`;

              return (
                <div
                  key={order.id}
                  className="bg-navy-900 border border-navy-800 hover:border-gold-500/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400 font-medium">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {getStatusDisplay(order.status)}
                      </span>
                      {isChatTier && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30">
                          Chat Live (₹99)
                        </span>
                      )}
                      {isWhatsAppTier && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          WhatsApp (₹149)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white font-heading">
                      {order.service.name}
                    </h3>

                    <div className="text-xs text-gray-400">
                      {t('orderedOn')}{' '}
                      {new Date(order.createdAt).toLocaleDateString(
                        language === 'hi' ? 'hi-IN' : 'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}{' '}
                      • ₹{order.amount}
                    </div>
                  </div>

                  {/* Separate Action Buttons according to Purchased Service */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* 1. Chat Live Tier (₹99) Actions */}
                    {isChatTier && (
                      <Link
                        href={`/consultation/ai-chat?orderId=${order.id}`}
                        className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-xs hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Bot className="w-4 h-4" />
                        <span>{language === 'hi' ? 'Chat Live शुरू करें' : 'Start Chat Live'}</span>
                      </Link>
                    )}

                    {/* 2. WhatsApp Tier (₹149) Actions */}
                    {isWhatsAppTier && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{language === 'hi' ? 'व्हाट्सएप चैट' : 'WhatsApp Chat'}</span>
                      </a>
                    )}

                    {/* Standard Report View for all orders */}
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="py-2.5 px-4 rounded-xl bg-navy-800 border border-navy-700 hover:border-gold-500/40 text-gray-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <FileText className="w-4 h-4 text-gold-400" />
                      <span>{language === 'hi' ? 'रिपोर्ट देखें' : 'View Report'}</span>
                    </Link>

                    {/* Report Only Upsell Option */}
                    {isReportOnlyTier && (
                      <Link
                        href="/checkout/comprehensive-destiny"
                        className="py-2 px-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Sparkles className="w-3 h-3 text-gold-400" />
                        <span>{language === 'hi' ? '+ Chat Live (₹99)' : '+ Chat Live (₹99)'}</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
