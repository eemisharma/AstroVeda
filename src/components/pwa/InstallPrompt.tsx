'use client';

import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    const dismissed = localStorage.getItem('astro_pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 1000 * 60 * 60 * 24 * 3) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      console.log('PWA installation accepted');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('astro_pwa_dismissed', Date.now().toString());
  };

  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-navy-900 border border-gold-500/40 rounded-2xl p-4 shadow-gold-glow-lg backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-white text-sm font-bold tracking-tight">
              {t('installAppTitle')}
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              {t('installAppDesc')}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-navy-800">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 px-3 rounded-xl bg-navy-800 text-xs font-semibold text-gray-300 hover:bg-navy-700 transition-colors text-center"
          >
            {t('notNowBtn')}
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-xs font-bold text-navy-950 hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('installBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
