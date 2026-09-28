'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { FileText, ArrowRight } from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  amount: number;
  createdAt: string | Date;
  service: {
    name: string;
  };
  birthProfile?: {
    dateOfBirth?: string;
    timeOfBirth?: string;
    birthCity?: string;
  } | null;
}

interface DashboardOrdersClientProps {
  orders: OrderItem[];
}

export default function DashboardOrdersClient({ orders }: DashboardOrdersClientProps) {
  const { t, language } = useLanguage();
  const [allOrders, setAllOrders] = useState<OrderItem[]>(orders);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('astroveda_customer_orders');
      if (stored) {
        const localOrders = JSON.parse(stored);
        if (Array.isArray(localOrders) && localOrders.length > 0) {
          setAllOrders((prev) => {
            const existingIds = new Set(prev.map((o) => o.id));
            const existingNums = new Set(prev.map((o) => o.orderNumber));
            const additions = localOrders
              .filter((lo: any) => lo && !existingIds.has(lo.id) && !existingNums.has(lo.orderNumber))
              .map((lo: any) => ({
                id: lo.id || lo.orderNumber,
                orderNumber: lo.orderNumber,
                status: lo.status || 'ANALYSIS_READY',
                amount: lo.amount || lo.service?.price || 49,
                createdAt: lo.createdAt || new Date().toISOString(),
                service: {
                  name: lo.service?.name || 'Vedic Astrology Consultation',
                },
                birthProfile: {
                  dateOfBirth: lo.birthProfile?.dateOfBirth || '',
                  timeOfBirth: lo.birthProfile?.timeOfBirth || '',
                  birthCity: lo.birthProfile?.birthCity || '',
                },
              }));
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
      console.warn('Failed to merge local customer orders in OrdersList:', e);
    }
  }, [orders]);

  const getStatusDisplay = (status: string) => {
    if (language === 'hi') {
      switch (status) {
        case 'PAID':
        case 'PROCESSING':
          return 'प्रक्रियाधीन';
        case 'ANALYSIS_READY':
        case 'DELIVERED':
          return 'रिपोर्ट तैयार';
        default:
          return status;
      }
    }
    return status;
  };

  const formatNumber = (num: number) => {
    return String(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight font-heading">
          {t('allOrdersTitle')}
        </h2>
        <span className="text-xs text-gray-400">
          {formatNumber(allOrders.length)} {t('totalCount')}
        </span>
      </div>

      {allOrders.length === 0 ? (
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-8 text-center">
          <p className="text-xs text-gray-400 mb-4">{t('noOrdersYet')}</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs shadow-gold-glow"
          >
            <span>{t('chooseServiceBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => {
            const isReady =
              order.status === 'ANALYSIS_READY' || order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                className="bg-navy-900 border border-navy-800 rounded-2xl p-5 hover:border-gold-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400 font-semibold">
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
                    </div>

                    <h3 className="text-base font-bold text-white font-heading">
                      {order.service.name}
                    </h3>

                    <div className="text-xs text-gray-400">
                      {order.birthProfile?.dateOfBirth ? (
                        <>
                          {t('summaryDob')} {order.birthProfile.dateOfBirth} {order.birthProfile.timeOfBirth ? `(${order.birthProfile.timeOfBirth})` : ''} {order.birthProfile.birthCity ? `• ${order.birthProfile.birthCity}` : ''}
                        </>
                      ) : (
                        <span>{language === 'hi' ? 'वैदिक जन्म विवरण पंजीकृत' : 'Vedic birth profile recorded'}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-black text-white">₹{order.amount}</div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString(
                          language === 'hi' ? 'hi-IN' : 'en-IN',
                          {
                            day: 'numeric',
                            month: 'short',
                          }
                        )}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isReady ? t('viewReportText') : t('viewStatusText')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
