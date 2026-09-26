'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, FileText, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setIsAuth(Boolean(data.user)))
      .catch(() => setIsAuth(false));
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-navy-950/95 backdrop-blur-lg border-t border-navy-800/80 px-2 py-2">
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${
            pathname === '/' ? 'text-gold-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 transition-transform ${pathname === '/' ? 'scale-110 drop-shadow-[0_0_8px_rgba(229,184,66,0.6)]' : ''}`} />
          <span className="text-[11px] leading-tight">{t('navHome')}</span>
          {pathname === '/' && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-0.5 animate-pulse shadow-gold-glow" />}
        </Link>

        <Link
          href="/services"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${
            pathname.startsWith('/services') ? 'text-gold-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 transition-transform ${pathname.startsWith('/services') ? 'scale-110 drop-shadow-[0_0_8px_rgba(229,184,66,0.6)]' : ''}`} />
          <span className="text-[11px] leading-tight">{t('navServices')}</span>
          {pathname.startsWith('/services') && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-0.5 animate-pulse shadow-gold-glow" />}
        </Link>

        <Link
          href={isAuth ? '/dashboard/orders' : '/login'}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${
            pathname.startsWith('/dashboard/orders') ? 'text-gold-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className={`w-5 h-5 mb-0.5 transition-transform ${pathname.startsWith('/dashboard/orders') ? 'scale-110 drop-shadow-[0_0_8px_rgba(229,184,66,0.6)]' : ''}`} />
          <span className="text-[11px] leading-tight">{t('navReports')}</span>
          {pathname.startsWith('/dashboard/orders') && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-0.5 animate-pulse shadow-gold-glow" />}
        </Link>

        <Link
          href={isAuth ? '/dashboard' : '/login'}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 ${
            pathname === '/dashboard' || pathname === '/login' ? 'text-gold-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <User className={`w-5 h-5 mb-0.5 transition-transform ${pathname === '/dashboard' || pathname === '/login' ? 'scale-110 drop-shadow-[0_0_8px_rgba(229,184,66,0.6)]' : ''}`} />
          <span className="text-[11px] leading-tight">{isAuth ? t('navDashboard') : t('signIn')}</span>
          {(pathname === '/dashboard' || pathname === '/login') && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-0.5 animate-pulse shadow-gold-glow" />}
        </Link>
      </div>
    </nav>
  );
}
