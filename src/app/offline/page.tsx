'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-navy-900 border border-navy-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5">
          <WifiOff className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-white mb-2 font-heading">
          {t('offlineTitle')}
        </h1>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {t('offlineDesc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('offlineRetry')}</span>
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-navy-800 border border-navy-700 text-gray-300 font-semibold text-sm hover:bg-navy-700 flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{t('returnHomeBtn')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
