'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/context';

export default function LiveActivityTicker() {
  const { language } = useLanguage();

  const [liveVisitors, setLiveVisitors] = useState(258);
  const [todayVisitors, setTodayVisitors] = useState(14832);
  const [rashiChecked, setRashiChecked] = useState(6428);

  useEffect(() => {
    // Live visitor continuous fluctuation (low to high, high to low)
    const liveInterval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        let next = prev + delta;
        if (next < 180) next += 7;
        if (next > 410) next -= 8;
        return next;
      });
    }, 2800);

    const todayInterval = setInterval(() => {
      setTodayVisitors((prev) => prev + 1);
    }, 9500);

    const scheduleNextRashi = () => {
      const delay = Math.floor(Math.random() * 4000) + 3000;
      return setTimeout(() => {
        setRashiChecked((prev) => prev + Math.floor(Math.random() * 3) + 1);
        timer = scheduleNextRashi();
      }, delay);
    };

    let timer = scheduleNextRashi();

    return () => {
      clearInterval(liveInterval);
      clearInterval(todayInterval);
      clearTimeout(timer);
    };
  }, []);

  const hindiItems = [
    { icon: 'live', text: `🟢 लाइव ऑनलाइन: ${liveVisitors} जातक अभी पोर्टल पर उपस्थित हैं` },
    { icon: 'visitors', text: `👥 आज के कुल विज़िटर्स: ${todayVisitors.toLocaleString('en-IN')}+ जातक` },
    { icon: 'rashi', text: `✨ आज जांची गई राशियाँ व कुंडलियाँ: ${rashiChecked.toLocaleString('en-IN')}+` },
    { icon: 'star', text: '⭐ 4.9/5 स्टार रेटिंग • 50,000+ संतुष्ट जातक' },
    { icon: 'sparkle', text: '✨ रोहन जी (मुंबई) ने ₹149 व्हाट्सएप परामर्श बुक किया' },
    { icon: 'clock', text: '⚡ 30 मिनट में त्वरित रिपोर्ट वितरण की गारंटी' },
    { icon: 'sparkle', text: '✨ प्रिया जी (वाराणसी) ने ₹99 संपूर्ण जीवन रिपोर्ट प्राप्त की' },
    { icon: 'shield', text: '🛡️ 100% गोपनीय जन्म विवरण व लाहिड़ी अयनांश गणना' },
    { icon: 'sparkle', text: '✨ विकास जी (पुणे) ने Chat Live परामर्श शुरू किया' },
    { icon: 'sparkle', text: '✨ अंजलि जी (बेंगलुरु) ने ₹89 विवाह अनुकूलता विश्लेषण प्राप्त किया' },
    { icon: 'zap', text: '💎 ₹499 प्रीमियम महाकुंडली: सभी 12 भाव, महादशा व सर्व-उपाय समाधान' },
  ];

  const englishItems = [
    { icon: 'live', text: `🟢 Live Online: ${liveVisitors} seekers browsing right now` },
    { icon: 'visitors', text: `👥 Today's Total Visitors: ${todayVisitors.toLocaleString('en-IN')}+ seekers` },
    { icon: 'rashi', text: `✨ Rashis & Kundlis Checked Today: ${rashiChecked.toLocaleString('en-IN')}+` },
    { icon: 'star', text: '⭐ 4.9/5 Star Rating • 50,000+ Happy Seekers' },
    { icon: 'sparkle', text: '✨ Rohan M. (Mumbai) booked ₹149 WhatsApp Consultation' },
    { icon: 'clock', text: '⚡ Guaranteed 30-Minute Rapid Delivery' },
    { icon: 'sparkle', text: '✨ Priya K. (Varanasi) received ₹99 Comprehensive Report' },
    { icon: 'shield', text: '🛡️ 100% Confidential Data & Lahiri Ayanamsha Accuracy' },
    { icon: 'sparkle', text: '✨ Vikas S. (Pune) connected with Chat Live' },
    { icon: 'sparkle', text: '✨ Anjali R. (Bengaluru) received ₹89 Marriage Compatibility Report' },
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
