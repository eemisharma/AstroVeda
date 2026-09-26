import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import Link from 'next/link';
import {
  ShieldAlert,
  BarChart3,
  ShoppingCart,
  Users,
  Settings,
  Sparkles,
  Layers,
  Home,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login?redirect=/admin');
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-navy-900 border border-red-500/40 rounded-3xl p-8 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-white mb-2">Admin Portal Restricted</h1>
          <p className="text-xs text-gray-300 mb-6">
            Your account does not possess administrator privileges.
          </p>
          <Link
            href="/dashboard"
            className="py-3 px-6 rounded-xl bg-navy-800 text-gold-300 text-xs font-semibold"
          >
            Go to Customer Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Admin Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  CONTROL PANEL
                </span>
              </div>
              <p className="text-xs text-gray-400">Manage orders, customers, pricing, and report regeneration</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="py-2 px-3.5 rounded-xl bg-navy-900 border border-navy-700 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-navy-900">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs font-semibold text-gray-200 hover:text-gold-400 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-gold-400" />
            <span>Overview & KPIs</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs font-semibold text-gray-200 hover:text-gold-400 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-gold-400" />
            <span>Orders Management</span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs font-semibold text-gray-200 hover:text-gold-400 transition-colors"
          >
            <Users className="w-4 h-4 text-gold-400" />
            <span>Customers</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs font-semibold text-gray-200 hover:text-gold-400 transition-colors"
          >
            <Layers className="w-4 h-4 text-gold-400" />
            <span>Services & Pricing</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs font-semibold text-gray-200 hover:text-gold-400 transition-colors"
          >
            <Settings className="w-4 h-4 text-gold-400" />
            <span>Settings & Demo</span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
