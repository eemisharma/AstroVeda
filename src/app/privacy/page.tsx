'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-3xl mx-auto text-gray-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-black text-white mb-6 font-heading">
        {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
      </h1>
      <div className="space-y-6 bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '१. एकत्र की जाने वाली जानकारी' : '1. Personal Information Collected'}
          </h2>
          <p>
            {language === 'hi'
              ? 'जब आप कोई परामर्श खरीदते हैं, तो हम आपका नाम, ईमेल, व्हाट्सएप मोबाइल नंबर, जन्म तिथि, जन्म समय और जन्म स्थान एकत्र करते हैं। यह जानकारी केवल आपकी जन्म कुंडली की सटीक गणना और रिपोर्ट वितरण के लिए अनिवार्य है।'
              : 'When you purchase a consultation, we collect your name, email address, WhatsApp mobile number, date of birth, time of birth, and birth city. This information is strictly required to calculate your astrological chart and deliver your report.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '२. हम आपकी जानकारी का उपयोग कैसे करते हैं' : '2. How We Use Your Data'}
          </h2>
          <p>
            {language === 'hi' ? 'आपकी जानकारी का उपयोग केवल निम्नलिखित कार्यों के लिए किया जाता है:' : 'Your information is used exclusively to:'}
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-gray-400">
            {language === 'hi' ? (
              <>
                <li>आपकी वैदिक जन्म कुंडली, ग्रह स्थिति और दशा काल की गणना करना।</li>
                <li>आपकी व्यक्तिगत ज्योतिषीय विश्लेषण रिपोर्ट तैयार करना।</li>
                <li>व्हाट्सएप के माध्यम से ऑर्डर पुष्टि और रिपोर्ट तैयार होने का अलर्ट भेजना।</li>
                <li>आपके सुरक्षित डैशबोर्ड में आपकी रिपोर्ट्स को सुरक्षित रखना।</li>
              </>
            ) : (
              <>
                <li>Compute your Vedic birth chart, planetary placements, and dashas.</li>
                <li>Generate your personalized analysis report.</li>
                <li>Send order confirmations and analysis alerts via WhatsApp.</li>
                <li>Allow you to access your consultation history in your secure dashboard.</li>
              </>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '३. विज्ञापन और ट्रैकिंग की सीमाएं' : '3. Advertising & Tracking Boundaries'}
          </h2>
          <p>
            {language === 'hi'
              ? 'हम केवल विज्ञापन प्रदर्शन का मूल्यांकन करने के लिए मानक संदर्भ टैग (जैसे UTM पैरामीटर) एकत्र करते हैं। हम कभी भी आपकी जन्म तिथि, समय या ज्योतिषीय निष्कर्ष किसी विज्ञापन नेटवर्क (जैसे Meta या Google) से साझा नहीं करते।'
              : 'We capture standard advertising attribution tags (such as UTM parameters and Meta Click IDs) solely to evaluate ad campaign performance. We NEVER transmit your birth date, birth time, coordinates, or astrological readings to Facebook, Google, or third-party ad networks.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '४. डेटा सुरक्षा मानक' : '4. Data Security'}
          </h2>
          <p>
            {language === 'hi'
              ? 'हम २५६-बिट एसएसएल एन्क्रिप्शन, सुरक्षित सर्वर-साइड सत्र और सख्त प्रमाणीकरण का उपयोग करते हैं जिससे कोई भी अनधिकृत व्यक्ति आपकी रिपोर्ट तक न पहुंच सके।'
              : 'We implement 256-bit SSL encryption, secure HTTP-only cookies, password hashing with industry standards, and strict authorization barriers preventing unauthorized users from accessing your reports.'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 font-heading">
            {language === 'hi' ? '५. डेटा विलोपन अनुरोध (Deletion)' : '5. Data Deletion Requests'}
          </h2>
          <p>
            {language === 'hi'
              ? 'आप किसी भी समय हमारी सहायता टीम से संपर्क करके अपने खाते और उससे जुड़े जन्म विवरण को पूरी तरह हटाने का अनुरोध कर सकते हैं।'
              : 'You have the right to request deletion of your account and associated birth profiles at any time by contacting our support team.'}
          </p>
        </section>
      </div>
    </div>
  );
}
