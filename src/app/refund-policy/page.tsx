'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function RefundPolicyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-3xl mx-auto text-gray-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-black text-white mb-6 font-heading">
        {language === 'hi' ? 'रिफंड एवं रद्दीकरण नीति' : 'Refund & Cancellation Policy'}
      </h1>
      <div className="space-y-6 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '1. व्यक्तिगत डिजिटल सेवाएं' : '1. Personalized Digital Services'}
          </h2>
          <p>
            {language === 'hi'
              ? 'चूंकि प्रत्येक ज्योतिषीय रिपोर्ट आपके सटीक जन्म निर्देशांकों और व्यक्तिगत ग्रह-दशा के आधार पर अलग से तैयार की जाती है, इसलिए पूर्ण और वितरित किए गए परामर्श सामान्यतः गैर-वापसी योग्य (Non-refundable) होते हैं।'
              : 'Because each astrology analysis is individually computed and generated based on your unique birth coordinates, completed and delivered consultations are generally non-refundable.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '2. विफल लेनदेन या दोहरा शुल्क' : '2. Failed Transactions & Double Charges'}
          </h2>
          <p>
            {language === 'hi'
              ? 'यदि बैंक सर्वर की विफलता के कारण आपके खाते से राशि कट गई लेकिन ऑर्डर सफल नहीं हुआ, या नेटवर्क समस्या के कारण दो बार शुल्क कट गया, तो संपूर्ण राशि 5-7 कार्य दिवसों में स्वतः आपके मूल भुगतान स्रोत में वापस कर दी जाती है।'
              : 'If your account was debited but the payment failed on the platform, or if a duplicate charge occurred due to a network glitch, full refunds are automatically initiated within 5–7 business days to your original payment method.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '3. तकनीकी सुधार एवं त्रुटि समाधान' : '3. Technical Errors & Corrections'}
          </h2>
          <p>
            {language === 'hi'
              ? 'यदि जन्म समय दर्ज करने में कोई मामूली त्रुटि हो गई हो, तो ऑर्डर के 1 घंटे के भीतर हमारे व्हाट्सएप सहायता डेस्क पर संपर्क करें। हमारी टीम बिना किसी अतिरिक्त शुल्क के आपकी रिपोर्ट पुनः तैयार कर देगी।'
              : 'If our system experiences an unexpected calculation failure or if you submitted a minor typo in your birth time within 1 hour of placing the order, contact our WhatsApp support desk immediately and our admin team will happily regenerate your report free of charge.'}
          </p>
        </section>
      </div>
    </div>
  );
}
