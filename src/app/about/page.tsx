'use client';

import { useLanguage } from '@/lib/i18n/context';
import { Sparkles, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto text-gray-300">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'हमारा दृष्टिकोण' : 'Our Philosophy'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          {language === 'hi' ? 'एस्ट्रोकंसल्ट के बारे में' : 'About AstroConsult'}
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          {language === 'hi'
            ? 'प्राचीन वैदिक खगोलीय सिद्धांतों को आधुनिक स्पष्टता, पूर्ण गोपनीयता और आत्म-सशक्तिकरण के साथ प्रस्तुत करना।'
            : 'Bridging timeless Vedic astronomical principles with modern clarity, privacy, and personal empowerment.'}
        </p>
      </div>

      <div className="space-y-8 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-10 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 font-heading">
            <Award className="w-5 h-5 text-gold-400" />
            <span>{language === 'hi' ? 'हमारा ध्येय (Mission)' : 'Our Mission'}</span>
          </h2>
          <p>
            {language === 'hi'
              ? 'ज्योतिष अपने विशुद्ध रूप में आत्म-चिंतन और समय-चक्रों की समझ का एक पवित्र विज्ञान है—न कि भय, अंधविश्वास या चमत्कारिक दावों का साधन। एस्ट्रोकंसल्ट की स्थापना जागरूक व्यक्तियों को उनकी व्यक्तिगत जन्म कुंडली की गरिमापूर्ण, पारदर्शी और मोबाइल-सुलभ व्याख्या प्रदान करने के लिए की गई है।'
              : 'Astrology at its highest is a sacred science of self-discovery and temporal awareness—not a game of fear, superstitious remedies, or supernatural guarantees. AstroConsult was created to offer thoughtful individuals a dignified, transparent, and mobile-first platform for personalized birth chart interpretations.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 font-heading">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>{language === 'hi' ? 'वैदिक सायन व निरयण (लाहिड़ी) प्रणाली' : 'The Vedic Sidereal System'}</span>
          </h2>
          <p>
            {language === 'hi'
              ? 'पश्चिमी ज्योतिष के विपरीत जो स्थिर ऋतुओं पर आधारित है, वैदिक ज्योतिष (ज्योतिष शास्त्र) निरयण राशि चक्र (Sidereal Zodiac) का पालन करता है। अयनांश (लाहिड़ी) की सूक्ष्म गणना से ग्रहों की वास्तविक खगोलीय स्थिति, आपका वास्तविक चंद्र राशि, लग्न और जन्म नक्षत्र निर्धारित होते हैं।'
              : 'Unlike Western astrology, which relies on the tropical equinoctial calendar, Vedic astrology (Jyotish) utilizes the sidereal zodiac. By accounting for the precession of the equinoxes (Ayanamsha), our calculations represent the observable celestial backdrop against which the planets move, identifying your true Moon sign (Chandra Rashi), Ascendant (Lagna), and birth Nakshatra.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 font-heading">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
            <span>{language === 'hi' ? 'हमारी नैतिक आचार संहिता' : 'Our Ethical Code'}</span>
          </h2>
          <ul className="space-y-2 list-disc list-inside text-gray-300">
            {language === 'hi' ? (
              <>
                <li><strong>दृढ़ कर्म-प्रधान दृष्टिकोण:</strong> हम भाग्यवादिता के बजाय स्वतंत्र संकल्प, पुरुषार्थ और विवेकपूर्ण निर्णयों को सर्वोपरि मानते हैं।</li>
                <li><strong>भय व अंधविश्वास का विरोध:</strong> हम किसी भी प्रकार के भय-आधारित दोषों या डराने वाली भविष्यवाणियों का कड़ा विरोध करते हैं।</li>
                <li><strong>जन्म विवरण की पूर्ण गोपनीयता:</strong> आपकी जन्म तिथि, समय और स्थान कभी किसी विज्ञापन नेटवर्क या तीसरे पक्ष से साझा नहीं किए जाते।</li>
                <li><strong>व्यावहारिक जीवन मार्गदर्शन:</strong> प्रत्येक रिपोर्ट आधुनिक जीवन के लिए उपयोगी आदतें, मानसिक संतुलन और आत्म-जागरूकता के उपाय प्रदान करती है।</li>
              </>
            ) : (
              <>
                <li><strong>Strict Non-Fatalism:</strong> We emphasize free will, intentional effort, and character over predetermined outcomes.</li>
                <li><strong>No Fear-Mongering:</strong> We reject threatening dosha predictions designed to exploit anxiety.</li>
                <li><strong>Complete Data Privacy:</strong> Your birth date, time, and coordinates are never sold or shared with ad networks.</li>
                <li><strong>Constructive Guidance:</strong> Every report offers practical habits and reflective insights tailored to modern life.</li>
              </>
            )}
          </ul>
        </section>

        <div className="pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-white font-bold font-heading">
              {language === 'hi' ? 'अपनी जन्म कुंडली का विश्लेषण प्राप्त करें' : 'Ready to explore your birth chart?'}
            </h4>
            <p className="text-xs text-gray-400">
              {language === 'hi'
                ? 'पारदर्शी मूल्य और त्वरित वितरण के साथ परामर्श आरंभ करें।'
                : 'Choose a service that fits your current life questions.'}
            </p>
          </div>
          <Link
            href="/services"
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all"
          >
            <span>{language === 'hi' ? 'सेवाएं देखें' : 'Explore Services'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
