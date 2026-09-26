'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, MessageSquare, User, Menu, X, Shield, LogOut, Headphones } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';
import AstroVedaLogo from '@/components/brand/AstroVedaLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    language === 'hi'
      ? 'नमस्ते AstroVeda, मुझे अपने ज्योतिष परामर्श और वैदिक उपचार के संबंध में सहायता चाहिए।'
      : 'Hello AstroVeda, I need assistance regarding my astrological consultation.'
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-navy-900/90 backdrop-blur-md border-b border-navy-700/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <AstroVedaLogo size={38} />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1 font-heading">
              {t('brandName')}
              <span className="text-gold-400">{t('brandSuffix')}</span>
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              {t('brandTagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-gold-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            {t('navHome')}
          </Link>
          <Link
            href="/services"
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith('/services') ? 'text-gold-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            {t('navServices')}
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              pathname === '/about' ? 'text-gold-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            {t('navAbout')}
          </Link>
          <Link
            href="/faq"
            className={`text-sm font-medium transition-colors ${
              pathname === '/faq' ? 'text-gold-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            {t('navFaq')}
          </Link>
        </nav>

        {/* Right CTA / Auth / Language Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('whatsappSupport')}</span>
          </a>

          {!loading && user ? (
            <div className="flex items-center gap-2">
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-navy-800 border border-gold-500/40 text-gold-300 hover:bg-navy-700 transition-colors"
              >
                {user.role === 'ADMIN' ? (
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span>{user.role === 'ADMIN' ? t('navAdmin') : t('navDashboard')}</span>
              </Link>
              <button
                onClick={handleLogout}
                title={t('signOut')}
                className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg bg-navy-800 border border-navy-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 hover:brightness-110 shadow-gold-glow transition-all"
            >
              {t('signIn')}
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher compact />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-navy-800 border border-navy-700 text-gray-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-navy-900/98 border-b border-navy-700 px-4 pt-3 pb-5 space-y-3 animate-in fade-in duration-150">
          <div className="pb-2 mb-2 border-b border-navy-800 flex items-center justify-between">
            <span className="text-xs text-gray-400">भाषा / Language:</span>
            <LanguageSwitcher />
          </div>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-gray-200 hover:text-gold-400"
          >
            {t('navHome')}
          </Link>
          <Link
            href="/services"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-gray-200 hover:text-gold-400"
          >
            {t('navServices')}
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-gray-200 hover:text-gold-400"
          >
            {t('navAbout')}
          </Link>
          <Link
            href="/faq"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm font-medium text-gray-200 hover:text-gold-400"
          >
            {t('navFaq')}
          </Link>
          <div className="pt-2 border-t border-navy-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-navy-800 border border-gold-500/30 text-gold-300 font-semibold text-sm"
                >
                  {user.role === 'ADMIN' ? t('navAdmin') : t('navDashboard')}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm"
              >
                {t('signIn')} / {t('signUp')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
