'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { Sparkles, ArrowRight, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-navy-900 border border-navy-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-3 shadow-gold-glow">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-heading">
            {t('signupTitle')}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {t('signupSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              {t('fullNameLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              {t('phoneLabel')}
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <span className="text-[10px] text-gray-500 mt-1 block">
              {t('phoneNote')}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 mt-2"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-navy-950 border-t-transparent" />
            ) : (
              <>
                <span>{t('signupBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-navy-800 text-center text-xs text-gray-400">
          <span>{t('hasAccountText')} </span>
          <Link href="/login" className="text-gold-400 font-semibold hover:underline">
            {t('signIn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
