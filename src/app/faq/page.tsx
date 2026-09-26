'use client';

import { useLanguage } from '@/lib/i18n/context';
import { HelpCircle, MessageSquare } from 'lucide-react';

export default function FAQPage() {
  const { language } = useLanguage();

  const faqs = language === 'hi'
    ? [
        {
          q: 'मुझे क्या जानकारी प्रदान करनी होगी?',
          a: 'अपनी सटीक वैदिक जन्म कुंडली प्राप्त करने के लिए आपको अपनी जन्म तिथि, सही जन्म समय और जन्म का शहर बताना होगा। वैकल्पिक लिंग चयन से रिपोर्ट में भाषा और संबोधन उचित रूप से तैयार होते हैं।',
        },
        {
          q: 'सटीक जन्म समय इतना महत्वपूर्ण क्यों है?',
          a: 'वैदिक ज्योतिष में लग्न (Ascendant) प्रत्येक दो घंटे में बदल जाता है। सटीक जन्म समय से ही आपका सही लग्न, सभी ९ ग्रहों के सटीक भाव और विंशोत्तरी महादशा की सटीक समयावधि तय होती है।',
        },
        {
          q: 'यदि मुझे अपना जन्म समय लगभग ही पता हो तो?',
          a: 'यदि आपको केवल अनुमानित समय (जैसे १५-३० मिनट के भीतर) पता है, तो अपना सर्वोत्तम अनुमान दर्ज करें। हम अस्पताल के जन्म प्रमाण पत्र या पारिवारिक डायरी से पुष्टि करने की सलाह देते हैं।',
        },
        {
          q: 'विश्लेषण तैयार होने में कितना समय लगता है?',
          a: 'हमारी सटीक गणितीय गणनाएं और व्यक्तिगत व्याख्याएं कुछ ही मिनटों से लेकर चुनी गई सेवा के अनुसार १२-२४ घंटों में तैयार हो जाती हैं।',
        },
        {
          q: 'मुझे अपनी रिपोर्ट कैसे प्राप्त होगी?',
          a: 'रिपोर्ट तैयार होते ही आपके व्हाट्सएप पर त्वरित सूचना और लिंक भेजा जाता है। रिपोर्ट आपके ग्राहक डैशबोर्ड में भी हमेशा सुरक्षित रहती है और आप जब चाहें प्रिंट/पीडीएफ डाउनलोड कर सकते हैं।',
        },
        {
          q: 'क्या मैं अपनी रिपोर्ट बाद में भी देख सकता हूँ?',
          a: 'हाँ, हमेशा। एक बार परामर्श लेने के बाद आपकी रिपोर्ट आपके ग्राहक खाते में स्थायी रूप से सुरक्षित रहती है, इसकी कोई समाप्ति तिथि नहीं है।',
        },
        {
          q: 'क्या मेरा जन्म विवरण गोपनीय और सुरक्षित है?',
          a: 'जी हाँ, शत-प्रतिशत। हम आपकी जन्म जानकारी कभी किसी विज्ञापन नेटवर्क या तीसरे पक्ष से साझा नहीं करते। सारा डेटा २५६-बिट एसएसएल एन्क्रिप्शन से सुरक्षित रहता है।',
        },
        {
          q: 'यदि भुगतान में कोई समस्या आए तो क्या होगा?',
          a: 'यदि बैंक या नेटवर्क के कारण भुगतान असफल होता है, तो आपके खाते से कोई शुल्क नहीं कटता। आप तुरंत पुनः प्रयास कर सकते हैं या हमारे व्हाट्सएप पर सीधी सहायता ले सकते हैं।',
        },
      ]
    : [
        {
          q: 'What information do I need to provide?',
          a: 'To generate your personalized Vedic chart, you need to provide your Date of Birth, Exact Time of Birth, and Birth City. An optional gender selection helps format report pronouns accurately.',
        },
        {
          q: 'Why is exact birth time so important?',
          a: 'The Ascendant (Lagna) changes zodiac signs every two hours. Exact birth time determines the precise rising sign, house placements of all 9 planets, and exact Vimshottari Mahadasha timing periods.',
        },
        {
          q: 'What if I only know my approximate birth time?',
          a: 'If you only know an approximate time (e.g. within 15–30 minutes), provide your best estimate. We recommend consulting hospital birth certificates or family records whenever possible.',
        },
        {
          q: 'How long does the analysis take?',
          a: 'Our algorithmic Kundli calculations and personalized interpretations are generated within minutes up to 12-24 hours depending on the depth of the chosen service.',
        },
        {
          q: 'How will I receive my report?',
          a: 'You will receive an automated WhatsApp notification the moment your analysis is ready. Your report is also permanently stored in your Customer Dashboard, and you can download a clean PDF.',
        },
        {
          q: 'Can I access my report later?',
          a: 'Yes, permanently. Once purchased, your report remains securely stored under your account in your Customer Dashboard with no expiration date.',
        },
        {
          q: 'Is my birth information secure?',
          a: 'Strictly yes. We do not sell your personal information or share birth details with advertising platforms. All data transmission uses 256-bit SSL encryption.',
        },
        {
          q: 'What happens if my payment fails?',
          a: 'If a payment fails or is declined by your bank, no money is captured. You will be directed to a helpful retry screen. You can also contact our support on WhatsApp for quick help.',
        },
      ];

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    language === 'hi'
      ? 'नमस्ते एस्ट्रोकंसल्ट, मुझे ज्योतिष परामर्श के संबंध में कुछ पूछना है।'
      : 'Hello AstroConsult, I have a question about my consultation.'
  )}`;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'ज्ञान केंद्र' : 'Knowledge Base'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          {language === 'hi'
            ? 'हमारे परामर्श, वैदिक गणनाओं और गोपनीयता मानकों से संबंधित सभी आवश्यक उत्तर।'
            : 'Everything you need to know about our consultations, calculations, and privacy standards.'}
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-navy-900 border border-navy-800 rounded-2xl p-5 sm:p-6 transition-all hover:border-gold-500/30"
          >
            <h3 className="text-base font-bold text-white mb-2 font-heading">
              {faq.q}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-navy-900/90 border border-gold-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-gold-glow">
        <h3 className="text-lg font-bold text-white mb-2 font-heading">
          {language === 'hi' ? 'क्या आपका कोई अन्य प्रश्न है?' : 'Still have questions?'}
        </h3>
        <p className="text-xs text-gray-300 mb-6 max-w-md mx-auto">
          {language === 'hi'
            ? 'हमारी सहायता टीम व्हाट्सएप पर उपलब्ध है। तुरंत संदेश भेजें और उत्तर प्राप्त करें।'
            : 'Our support team is always available on WhatsApp to answer questions or assist with your order.'}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'hi' ? 'व्हाट्सएप पर पूछें' : 'Chat on WhatsApp'}</span>
        </a>
      </div>
    </div>
  );
}
