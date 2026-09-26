'use client';

import Link from 'next/link';
import { ShieldCheck, Lock, HeartHandshake } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import AstroVedaLogo from '@/components/brand/AstroVedaLogo';

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="w-full bg-navy-950 border-t border-navy-800/80 pt-12 pb-24 md:pb-12 text-gray-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-navy-800/60">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-900/50 border border-navy-800">
            <Lock className="w-4 h-4 text-gold-400 shrink-0" />
            <div>
              <div className="text-white font-semibold text-xs">{t('trust1Title')}</div>
              <div className="text-[11px] text-gray-400">{language === 'hi' ? 'गोपनीय जन्म डेटा' : 'Strict birth privacy'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-900/50 border border-navy-800">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <div>
              <div className="text-white font-semibold text-xs">{language === 'hi' ? 'सटीक वैदिक गणना' : 'Verified Vedic Math'}</div>
              <div className="text-[11px] text-gray-400">{language === 'hi' ? 'लाहिड़ी अयनांश पद्धति' : 'Accurate sidereal charts'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-900/50 border border-navy-800">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <div>
              <div className="text-white font-semibold text-xs">{t('trust2Title')}</div>
              <div className="text-[11px] text-gray-400">{language === 'hi' ? 'जागरूक मार्गदर्शन' : 'No fear-based selling'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-900/50 border border-navy-800">
            <HeartHandshake className="w-4 h-4 text-gold-400 shrink-0" />
            <div>
              <div className="text-white font-semibold text-xs">{t('trust3Title')}</div>
              <div className="text-[11px] text-gray-400">{language === 'hi' ? 'तत्पर सहायता' : 'Prompt customer help'}</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <AstroVedaLogo size={32} />
              <span className="text-base font-bold text-white font-heading">
                {t('brandName')}<span className="text-gold-400">{t('brandSuffix')}</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-[12px]">
              {t('footerDesc')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {language === 'hi' ? 'वैदिक रिपोर्ट्स (५ स्तर)' : 'Vedic Reports (5 Tiers)'}
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/services/quick-kundli-glance" className="hover:text-gold-400 transition-colors flex items-center justify-between pr-4">
                  <span>{language === 'hi' ? 'त्वरित कुंडली दृष्टि' : 'Quick Kundli Glance'}</span>
                  <span className="text-gold-400 font-bold text-[11px]">₹49</span>
                </Link>
              </li>
              <li>
                <Link href="/services/life-direction-transit" className="hover:text-gold-400 transition-colors flex items-center justify-between pr-4">
                  <span>{language === 'hi' ? 'गोचर एवं जीवन दिशा' : 'Life Direction Transit'}</span>
                  <span className="text-gold-400 font-bold text-[11px]">₹89</span>
                </Link>
              </li>
              <li>
                <Link href="/services/comprehensive-destiny" className="hover:text-gold-400 transition-colors flex items-center justify-between pr-4">
                  <span>{language === 'hi' ? 'विस्तृत भाग्य कुंडली' : 'Destiny Kundli'}</span>
                  <span className="text-gold-400 font-bold text-[11px]">₹99</span>
                </Link>
              </li>
              <li>
                <Link href="/services/vedic-kundli-whatsapp" className="hover:text-gold-400 transition-colors flex items-center justify-between pr-4">
                  <span>{language === 'hi' ? 'वैदिक कुंडली + व्हाट्सएप' : 'Kundli + WhatsApp'}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">₹149</span>
                </Link>
              </li>
              <li>
                <Link href="/services/premium-master-horoscope" className="hover:text-gold-400 transition-colors flex items-center justify-between pr-4">
                  <span>{language === 'hi' ? 'प्रीमियम मास्टर पैकेज' : 'Premium Master Package'}</span>
                  <span className="text-amber-400 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded">₹499 जल्द</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {language === 'hi' ? 'सहायता एवं मंच' : 'Platform & Help'}
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-400 transition-colors">
                  {t('navFaq')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-gold-400 transition-colors">
                  {t('navDashboard')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gold-400 transition-colors">
                  {t('signIn')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {language === 'hi' ? 'नीति एवं नियम' : 'Legal & Transparency'}
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                  {language === 'hi' ? 'गोपनीयता नीति (Privacy)' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-400 transition-colors">
                  {language === 'hi' ? 'सेवा की शर्तें (Terms)' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-gold-400 transition-colors">
                  {language === 'hi' ? 'रिफंड नीति' : 'Refund Policy'}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-gold-400 transition-colors">
                  {language === 'hi' ? 'ज्योतिषीय अस्वीकरण' : 'Astrology Disclaimer'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-navy-800/60 text-[11px] text-gray-400 space-y-3 text-center md:text-left">
          <p>
            <strong className="text-gray-300">{t('footerDisclaimerTitle')}</strong> {t('footerDisclaimerText')}
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-gray-400 pt-2">
            <span>© {new Date().getFullYear()} {t('brandName')}{t('brandSuffix')}. {t('rightsReserved')}</span>
            <span>{t('designedForMobile')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
