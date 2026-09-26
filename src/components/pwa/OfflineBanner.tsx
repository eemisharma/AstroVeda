'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function OfflineBanner() {
  const { t } = useLanguage();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500/95 backdrop-blur text-navy-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 text-center sticky top-0 z-50 transition-all">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{t('offlineAlert')}</span>
    </div>
  );
}
