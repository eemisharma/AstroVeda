'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi', // Default to Hindi
  setLanguage: () => {},
  t: (key: TranslationKey) => translations.hi[key] || '',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi'); // Default: Hindi with Devanagari

  useEffect(() => {
    try {
      const stored = localStorage.getItem('astro_lang') as Language;
      if (stored === 'en' || stored === 'hi') {
        setLanguageState(stored);
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('astro_lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {}
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.hi[key] || translations.en[key] || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
