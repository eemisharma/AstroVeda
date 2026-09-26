'use client';

import { Sparkles, ShieldCheck, Clock, Zap, Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function LiveActivityTicker() {
  const { language } = useLanguage();

  const hindiItems = [
    { icon: 'live', text: '🔴 लाइव: 1,520+ जातक आज जन्म कुंडली परामर्श ले चुके हैं' },
    { icon: 'star', text: '⭐ 4.9/5 स्टार रेटिंग • 50,000+ संतुष्ट जातक' },
    { icon: 'sparkle', text: '✨ अमित जी (नई दिल्ली) ने ₹149 व्हाट्सएप परामर्श बुक किया' },
    { icon: 'clock', text: '⚡ 30 मिनट में त्वरित रिपोर्ट वितरण की गारंटी' },
    { icon: 'shield', text: '🛡️ 100% गोपनीय जन्म विवरण व लाहिड़ी अयनांश गणना' },
    { icon: 'sparkle', text: '✨ पूजा जी (जयपुर) ने ₹99 संपूर्ण जीवन रिपोर्ट प्राप्त की' },
    { icon: 'zap', text: '💎 ₹499 प्रीमियम महाकुंडली: सभी 12 भाव, महादशा व सर्व-उपाय समाधान' },
  ];

  const englishItems = [
    { icon: 'live', text: '🔴 Live: 1,520+ seekers consulted today' },
    { icon: 'star', text: '⭐ 4.9/5 Star Rating • 50,000+ Happy Seekers' },
    { icon: 'sparkle', text: '✨ Amit K. (New Delhi) booked ₹149 WhatsApp Consultation' },
    { icon: 'clock', text: '⚡ Guaranteed 30-Minute Rapid Delivery' },
    { icon: 'shield', text: '🛡️ 100% Confidential Data & Lahiri Ayanamsha Accuracy' },
    { icon: 'sparkle', text: '✨ Pooja S. (Jaipur) received ₹99 Comprehensive Report' },
    { icon: 'zap', text: '💎 ₹499 Premium Maha-Kundli: All 12 Houses, Dashas & Full Remedies' },
  ];

  const items = language === 'hi' ? hindiItems : englishItems;

  return (
    <div className="w-full bg-navy-900/80 border-y border-gold-500/20 py-2 overflow-hidden backdrop-blur-md relative z-10">
      <div className="flex w-max items-center animate-ticker whitespace-nowrap hover:[animation-play-state:paused]">
        {/* Double the list for infinite looping */}
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 mx-6 text-xs text-gray-300 font-medium select-none"
          >
            <span>{item.text}</span>
            <span className="text-gold-500/40 text-xs ml-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
