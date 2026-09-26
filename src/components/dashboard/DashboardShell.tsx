'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { LayoutDashboard, FileText, UserCircle, Plus } from 'lucide-react';

interface DashboardShellProps {
  userName: string;
  children: React.ReactNode;
}

export default function DashboardShell({ userName, children }: DashboardShellProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: t('dashOverview'), icon: LayoutDashboard, exact: true },
    { href: '/dashboard/orders', label: t('dashMyReports'), icon: FileText, exact: false },
    { href: '/dashboard/profile', label: t('dashProfile'), icon: UserCircle, exact: false },
  ];

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-navy-800">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight font-heading">
              {t('welcomeUser')} <span className="text-gold-400">{userName}</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {t('dashSubtagline')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/services"
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('dashNewConsultation')}</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Sub-nav */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-navy-900">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                  isActive
                    ? 'bg-gold-500/10 border border-gold-500/40 text-gold-300'
                    : 'bg-navy-900 border border-navy-800 text-gray-400 hover:text-gray-200 hover:border-navy-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
}
