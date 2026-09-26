'use client';

import { useLanguage } from '@/lib/i18n/context';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export default function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all select-none ${
        language === 'hi'
          ? 'bg-gold-500/15 border-gold-500/40 text-gold-300 hover:bg-gold-500/25 shadow-gold-glow'
          : 'bg-navy-800 border-navy-700 text-gray-300 hover:text-white'
      } ${className}`}
      title={language === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}
      aria-label="Change Language"
    >
      <Globe className="w-3.5 h-3.5 text-gold-400 shrink-0" />
      <span>{language === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}</span>
      <span className="text-[10px] text-gray-400 ml-0.5 font-normal">
        {language === 'hi' ? 'EN' : 'हिन्दी'}
      </span>
    </button>
  );
}
