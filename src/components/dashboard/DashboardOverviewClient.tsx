'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { Sparkles, Clock, CheckCircle2, ArrowRight, FileText, Compass } from 'lucide-react';

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
  report: {
    id: string;
  } | null;
}

interface DashboardOverviewClientProps {
  orders: OrderItem[];
}

export default function DashboardOverviewClient({ orders }: DashboardOverviewClientProps) {
  const { t, language } = useLanguage();

  const activeOrders = orders.filter(
    (o) => o.status === 'PROCESSING' || o.status === 'PAID'
  );
  const readyReports = orders.filter(
    (o) => o.status === 'ANALYSIS_READY' || o.status === 'DELIVERED'
  );

  const formatNumber = (num: number) => {
    if (language === 'hi') {
      const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      return String(num).replace(/\d/g, (d) => devanagariDigits[parseInt(d, 10)]);
    }
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
          return 'रिपोर्ट तैयार';
        default:
          return status;
      }
    }
    return status;
  };

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
            {formatNumber(orders.length)}
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

      {/* Recent / Active Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight font-heading">
            {t('myConsultationsTitle')}
          </h2>
          {orders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="text-xs text-gold-400 hover:underline font-semibold"
            >
              {t('viewAllBtn')}
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
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
            {orders.map((order) => {
              const isReady =
                order.status === 'ANALYSIS_READY' || order.status === 'DELIVERED';

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

                  <div>
                    {isReady ? (
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-1.5 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{t('viewReportText')}</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="py-2.5 px-5 rounded-xl bg-navy-800 border border-navy-700 text-gray-300 font-semibold text-xs hover:bg-navy-750 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>{t('viewStatusText')}</span>
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
