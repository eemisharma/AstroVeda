'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { Headphones } from 'lucide-react';
import CustomerCareDrawer from './CustomerCareDrawer';

export default function CustomerCareButton() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button on Bottom Right */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        aria-label="Customer Care & Vedic Guidance"
        className="fixed bottom-20 md:bottom-6 right-4 z-30 group flex items-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 font-bold text-xs shadow-gold-glow-lg hover:brightness-110 active:scale-95 transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-navy-950/20 flex items-center justify-center shrink-0">
          <Headphones className="w-3.5 h-3.5 text-navy-950" />
        </div>
        <span className="hidden sm:inline font-heading tracking-wide">
          {language === 'hi' ? 'सहायता केंद्र' : 'Customer Care'}
        </span>
        <span className="sm:hidden font-heading">
          {language === 'hi' ? 'सहायता' : 'Help'}
        </span>
      </button>

      {/* Customer Care Drawer */}
      <CustomerCareDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
