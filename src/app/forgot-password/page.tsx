'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-navy-900 border border-navy-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-3 shadow-gold-glow">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-heading">
            {t('forgotTitle')}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {t('forgotSubtitle')}
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-300">
              {t('resetSentDesc')} (<strong>{email}</strong>)
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-semibold hover:underline mt-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToSignIn')}</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all active:scale-[0.99] mt-2"
            >
              {t('sendResetBtn')}
            </button>

            <div className="text-center mt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-400 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('backToSignIn')}</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
