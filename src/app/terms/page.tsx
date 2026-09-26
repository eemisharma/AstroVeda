'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function TermsPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-3xl mx-auto text-gray-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-black text-white mb-6 font-heading">
        {language === 'hi' ? 'सेवा की शर्तें (Terms of Service)' : 'Terms of Service'}
      </h1>
      <div className="space-y-6 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '1. शर्तों की स्वीकृति' : '1. Acceptance of Terms'}
          </h2>
          <p>
            {language === 'hi'
              ? 'एस्ट्रोकंसल्ट का उपयोग करके या ज्योतिष परामर्श खरीदकर, आप इन सेवा शर्तों से बंधे होने की सहमति देते हैं। यदि आप सहमत नहीं हैं, तो कृपया मंच का उपयोग न करें।'
              : 'By accessing AstroConsult or purchasing an astrology consultation, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the platform.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '2. परामर्श का स्वरूप' : '2. Consultation Nature'}
          </h2>
          <p>
            {language === 'hi'
              ? 'एस्ट्रोकंसल्ट पर उपलब्ध ज्योतिषीय रिपोर्ट व्यक्तिगत मार्गदर्शन, आत्म-चिंतन और शैक्षणिक उद्देश्यों के लिए हैं। यह किसी योग्य चिकित्सक, कानूनी अधिवक्ता या प्रमाणित वित्तीय सलाहकार का विकल्प नहीं है।'
              : 'Astrology analysis and reports provided on AstroConsult are intended for personal guidance, educational reflection, and self-awareness. Interpretations are based on traditional Vedic principles and algorithmic models and should not substitute for professional medical, legal, or certified financial advice.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '3. जन्म विवरण की सटीकता की जिम्मेदारी' : '3. User Responsibility for Birth Details'}
          </h2>
          <p>
            {language === 'hi'
              ? 'वैदिक गणनाएं उपयोगकर्ता द्वारा दी गई जन्म तिथि, सटीक समय और स्थान पर आधारित होती हैं। गलत या अधूरी जानकारी दर्ज करने के कारण गणना में आने वाली भिन्नता के लिए उपयोगकर्ता स्वयं जिम्मेदार है।'
              : 'Astrological calculations are directly derived from the birth date, exact birth time, and birth location provided by the user. AstroConsult is not liable for calculation variances resulting from inaccurate user inputs.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '4. भुगतान एवं रिपोर्ट डिलीवरी' : '4. Payment & Delivery'}
          </h2>
          <p>
            {language === 'hi'
              ? 'सभी शुल्क भारतीय रुपये (INR) में दर्शाए गए हैं। सफल भुगतान सत्यापन के बाद ऑर्डर स्वतः सक्रिय हो जाता है। रिपोर्ट ग्राहक डैशबोर्ड में सुरक्षित उपलब्ध कराई जाती है।'
              : 'All fees are quoted in Indian Rupees (INR). Orders are processed upon successful payment verification. Delivery estimates are indicative and reports are accessible via the Customer Dashboard.'}
          </p>
        </section>
      </div>
    </div>
  );
}
