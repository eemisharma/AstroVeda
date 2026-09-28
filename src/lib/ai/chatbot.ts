export interface ChatUserAstrologyProfile {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  birthCity?: string;
  lagna?: string;
  moonSign?: string;
  sunSign?: string;
  nakshatra?: string;
  currentDasha?: string;
  problemCategory?: string;
  orderNumber?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export class VedicChatbotService {
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY;
  }

  async generateReply(params: {
    message: string;
    language: 'hi' | 'en';
    chatHistory: ChatMessage[];
    profile: ChatUserAstrologyProfile;
  }): Promise<string> {
    const { message, language, chatHistory, profile } = params;

    // 1. Try Live Gemini API if API key is present
    if (this.apiKey && this.apiKey.trim() !== '') {
      try {
        const liveReply = await this.callGeminiAPI({ message, language, chatHistory, profile });
        if (liveReply && liveReply.trim().length > 0) {
          return liveReply;
        }
      } catch (err) {
        console.warn('Live Gemini API call failed or timed out, switching to built-in Vedic engine:', err);
      }
    }

    // 2. Fallback to Built-in Dynamic Astrological Reasoning Engine
    return this.generateVedicFallbackReply({ message, language, profile });
  }

  private async callGeminiAPI(params: {
    message: string;
    language: 'hi' | 'en';
    chatHistory: ChatMessage[];
    profile: ChatUserAstrologyProfile;
  }): Promise<string | null> {
    const { message, language, chatHistory, profile } = params;

    const name = profile.fullName || (language === 'hi' ? 'जातक' : 'Friend');
    const lagna = profile.lagna || 'Aries (मेष)';
    const moon = profile.moonSign || 'Scorpio (वृश्चिक)';
    const sun = profile.sunSign || 'Leo (सिंह)';
    const nakshatra = profile.nakshatra || 'Rohini';
    const dasha = profile.currentDasha || 'Rahu / Jupiter';
    const city = profile.birthCity || 'India';
    const focusArea = profile.problemCategory || 'General Life Guidance';

    const systemInstruction = `You are "आचार्य AstroVeda" (Acharya AstroVeda), an enlightened, compassionate, highly respected master Vedic Astrologer representing AstroVeda.
You hold deep mastery in Maharishi Parashara, Jaimini Sutras, and Bhrigu Nadi astrology.

You are conducting a private, premium consultation with:
- Client Name: ${name}
- Gender: ${profile.gender || 'Not specified'}
- Birth Details: Date: ${profile.birthDate || 'Known'}, Time: ${profile.birthTime || 'Known'}, Place: ${city}
- Ascendant (लग्न): ${lagna}
- Moon Sign (चन्द्र राशि): ${moon}
- Sun Sign (सूर्य राशि): ${sun}
- Birth Nakshatra (नक्षत्र): ${nakshatra}
- Current Mahadasha / Cycle (वर्तमान दशा): ${dasha}
- Client Area of Interest / Concern: ${focusArea}

CONSULTATION GUIDELINES:
1. Greet the querent respectfully and warmly (e.g., "सादर प्रणाम ${name} जी" in Hindi or "Warm blessings and Namaste ${name}" in English).
2. Synthesize your astrological analysis specifically referencing their ${lagna} Lagna, ${moon} Moon Sign, birth place ${city}, and their current ${dasha} planetary period.
3. Offer practical, sacred Vedic remedies:
   - Presiding Deity Worship / Stotram or Mantras (e.g., Mahamrityunjaya, Gayatri, Hanuman Chalisa, Sri Suktam)
   - Charitable Deeds / Daan (giving items related to afflicted planets on specific days)
   - Fasting / Auspicious colors and days
   - Gemstones or Rudraksha with ethical guidance and caveat
4. Tone: Grounded, spiritually uplifting, realistic, empathetic, and wise. DO NOT induce fear, fatalism, or doom.
5. Language: Respond in ${language === 'hi' ? 'rich, polite Hindi (Devanagari script)' : 'fluent, elegant English'}. If the user asks in Hinglish, answer in clear, accessible Hindi.
6. Formatting: Use clean markdown spacing, bullet points for remedies, and bold highlights for planetary influences.`;

    const recentHistory = chatHistory.slice(-8).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const contents = [
      ...recentHistory,
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  }

  private generateVedicFallbackReply(params: {
    message: string;
    language: 'hi' | 'en';
    profile: ChatUserAstrologyProfile;
  }): string {
    const { message, language, profile } = params;
    const lower = message.toLowerCase();
    const isHi = language === 'hi' || /[\u0900-\u097F]/.test(message);

    const name = profile.fullName || (isHi ? 'प्रिय जातक' : 'Friend');
    const lagna = profile.lagna || 'मेष (Aries)';
    const moon = profile.moonSign || 'वृश्चिक (Scorpio)';
    const dasha = profile.currentDasha || 'बृहस्पति - शनि';
    const nakshatra = profile.nakshatra || 'रोहिणी (Rohini)';
    const city = profile.birthCity || 'वाराणसी';

    // Unique variance hash based on querent message and name
    let hash = 0;
    const combinedStr = message + (profile.fullName || '') + (profile.birthCity || '');
    for (let i = 0; i < combinedStr.length; i++) hash = (hash << 5) - hash + combinedStr.charCodeAt(i);
    const varSeed = Math.abs(hash);

    // 1. Career / Job / Promotion / Business / Government Jobs
    if (
      lower.includes('career') ||
      lower.includes('job') ||
      lower.includes('business') ||
      lower.includes('work') ||
      lower.includes('sarkari') ||
      lower.includes('naukri') ||
      lower.includes('नौकरी') ||
      lower.includes('करियर') ||
      lower.includes('व्यापार') ||
      lower.includes('प्रमोशन') ||
      lower.includes('इंटरव्यू') ||
      lower.includes('सरकारी')
    ) {
      const careerVariationsHi = [
        `सादर प्रणाम **${name} जी**! 🌟
(जन्म स्थान: ${city} • ${lagna} लग्न • ${moon} चंद्र राशि)

आपकी जन्म कुंडली में **दशम भाव (कर्म भाव)** और लग्न के स्वामी ग्रह का संबंध स्पष्ट करता है कि आपके भीतर स्वतंत्र निर्णय लेने और उत्तरदायित्व निभाने की असाधारण क्षमता है। वर्तमान में आपकी चल रही **${dasha}** महादशा कार्यक्षेत्र में परिवर्तन, पदोन्नति और स्थायित्व के नए अवसर लेकर आ रही है।

### 🔮 कर्म एवं आजीविका विश्लेषण:
* **दशम भाव प्रभाव:** सूर्य एवं गुरु की अनुकूल दृष्टि यह दर्शाती है कि आगामी 4 से 6 महीनों में आपके प्रयासों का उत्तम प्रतिफल प्राप्त होगा। सरकारी, तकनीकी, बैंकिंग अथवा प्रबंधकीय क्षेत्रों में विशेष लाभ का योग है।
* **व्यापार / व्यवसाय:** यदि आप नवीन उद्यम या साझेदारी का विचार कर रहे हैं, तो अपने कागजी समझौतों को पारदर्शी रखें। अनुभवी वरिष्ठों की सलाह आपके लिए मार्गदर्शक सिद्ध होगी।
* **शुभ कालखंड:** आने वाले महीनों में ग्रह गोचर आपके पक्ष में संरेखित हो रहा है, जिससे लंबे समय से रुका हुआ कार्य स्वतः गति पकड़ेगा।

### 📿 कार्यक्षेत्र में सफलता हेतु अचूक वैदिक उपाय:
1. **सूर्य उपासना:** प्रतिदिन प्रातः तांबे के लोटे में जल, अक्षत और रोली डालकर भगवान सूर्य को अर्घ्य दें और *"ॐ घृणिः सूर्याय नमः"* का 11 बार जप करें।
2. **कार्य सिद्धि मंत्र:** कार्यस्थल पर जाने से पूर्व एक चम्मच मीठा दही अथवा गुड़ ग्रहण करें।
3. **शनि कृपा:** शनिवार की संध्या को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।

पुरुषार्थ और सही समय का वैदिक समन्वय आपको निश्चित ही श्रेष्ठ पद और सम्मान दिलाएगा।`,

        `सादर प्रणाम **${name} जी**! 🌟
(जन्म विवरण: ${city} • लग्न: ${lagna} • नक्षत्र: ${nakshatra})

आपकी पत्रिका का अध्ययन करने पर ज्ञात होता है कि **दशमेश (10th Lord)** की स्थिति आपके कर्मक्षेत्र में कर्मठता और अनुशासन की मांग करती है। वर्तमान **${dasha}** के अंतर्गत आपको अपनी प्राथमिकताओं को पुनर्गठित करने का स्वर्णिम अवसर मिल रहा है।

### 🔮 कार्यक्षेत्र व पदोन्नति अंतर्दृष्टि:
* **कार्यस्थल पर स्थिति:** सहकर्मियों के साथ सामंजस्य बनाकर चलें। आपके द्वारा किए गए सूक्ष्म कार्यों की वरिष्ठ अधिकारी गुप्त रूप से समीक्षा कर रहे हैं, जो आगामी पदोन्नति का मार्ग प्रशस्त करेगी।
* **सरकारी सेवा / प्रतियोगी परीक्षा:** प्रतियोगी परीक्षाओं में एकाग्रता बढ़ाने के लिए ब्रह्ममुहूर्त में अध्ययन करना विशेष फलदायी रहेगा।
* **वित्तीय लाभ:** कार्यक्षेत्र में आपकी प्रतिष्ठा बढ़ने के साथ-साथ आर्थिक आय में भी उत्तरोत्तर वृद्धि के संकेत हैं।

### 📿 विशिष्ट वैदिक उपाय:
1. **श्री गणेश वंदना:** बुधवार के दिन भगवान गणेश को 21 दूर्वा अर्पित करें और *"ॐ गं गणपतये नमः"* का शांत मन से जप करें।
2. **हनुमान चालीसा:** मंगलवार को तीन बार हनुमान चालीसा का पाठ करें, इससे कार्यक्षेत्र के समस्त विरोधी शांत होंगे।
3. **पक्षी सेवा:** प्रतिदिन पक्षियों को जल व सप्तधान्य (मिश्रित अनाज) डालें।`
      ];

      const chosenHi = careerVariationsHi[varSeed % careerVariationsHi.length];
      if (isHi) return chosenHi;

      return `Warm blessings **${name}**! 🌟
(Birth City: ${city} • ${lagna} Ascendant • ${moon} Moon Sign)

Looking at your Vedic horoscope, your **10th House of Career & Karma** is energized under your active **${dasha}** planetary cycle. 

### 🔮 Professional Astrological Insights:
* **Career Trajectory:** The planetary alignment indicates that steady perseverance and domain expertise will unlock significant authority. Stalled promotions or job transitions begin moving favorably over the coming 3 to 6 months.
* **Venture & Expansion:** Collaborative and advisory capacities, technology, administrative leadership, and strategic commerce are highly aligned with your planetary strengths.
* **Favorable Timing:** Upcoming transits support meaningful institutional recognition and financial progression.

### 📿 Sacred Vedic Remedies for Career Victory:
1. **Surya Arghya:** Offer clean water to the rising Sun daily from a copper vessel with a pinch of red kumkum, reciting *"Om Ghrinih Suryaya Namah"*.
2. **Ganesha Archana:** Offer green grass (Durva) to Lord Ganesha on Wednesdays to eliminate hidden professional roadblocks.
3. **Ethical Karma:** Support underprivileged service workers on Saturdays to invoke Lord Saturn's protective blessings.

Please feel free to ask about any specific date, interview, or business venture!`;
    }

    // 2. Marriage / Love / Relationship / Divorce / Matchmaking
    if (
      lower.includes('marriage') ||
      lower.includes('love') ||
      lower.includes('relationship') ||
      lower.includes('shadi') ||
      lower.includes('vivah') ||
      lower.includes('divorce') ||
      lower.includes('विवाह') ||
      lower.includes('शादी') ||
      lower.includes('प्रेम') ||
      lower.includes('दांपत्य') ||
      lower.includes('संबंध') ||
      lower.includes('तलाक') ||
      lower.includes('पति') ||
      lower.includes('पत्नी')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🌸
(जन्म स्थान: ${city} • ${lagna} लग्न • नक्षत्र: ${nakshatra})

आपकी कुंडली में **सप्तम भाव (विवाह व दांपत्य भाव)** और कारक ग्रह देवगुरु बृहस्पति व शुक्र की स्थिति का सूक्ष्म विश्लेषण करने पर, दांपत्य जीवन में आपसी समझ और भावनात्मक संवाद की महत्ता सर्वोपरि है।

### 🔮 विवाह एवं दांपत्य विश्लेषण:
* **सप्तम भाव का प्रभाव:** आपका जीवनसाथी संस्कारी, स्वाभिमानी, बौद्धिक और पारिवारिक मर्यादाओं का आदर करने वाला होगा।
* **विवाह के शुभ योग:** वर्तमान **${dasha}** के शुभ प्रभाव से आगामी महीनों में विवाह संबंधी प्रस्तावों में सकारात्मक प्रगति के मजबूत योग बन रहे हैं।
* **सावधानी:** क्रोध, अहंकार या अनावश्यक अपेक्षाओं के कारण रिश्तों में खिंचाव से बचें। किसी भी बात को मन में दबाने के बजाय मधुर वाणी से संवाद करें।

### 📿 सुखी दांपत्य एवं शीघ्र विवाह हेतु वैदिक उपाय:
1. **गौरी-शंकर उपासना:** प्रत्येक सोमवार को शिवलिंग पर जल और कच्चा दूध अर्पित करें तथा माता पार्वती को सिंदूर चढ़ाएं।
2. **मंत्र साधना:** प्रतिदिन *"ॐ नमः शिवाय"* का 108 बार रुद्राक्ष माला से जप करें।
3. **गौ सेवा:** शुक्रवार को गाय को आटे की लोई में थोड़ा गुड़ रखकर अपने हाथों से खिलाएं।
4. **हल्दी स्नान:** गुरुवार के दिन स्नान के जल में एक चुटकी पिसी हल्दी मिलाकर स्नान करें।`;
      } else {
        return `Warm blessings **${name}**! 🌸
(Birth City: ${city} • ${lagna} Ascendant • ${moon} Moon)

In your Vedic birth chart, your **7th House of Sacred Partnerships** is illuminated by Jupiterian and Venusian harmonics. 

### 🔮 Relationship & Marriage Readings:
* **Spouse Characteristics:** Planetary dynamics indicate a loyal, intellectually grounded, and self-respecting companion who values mutual respect and familial integrity.
* **Auspicious Timing:** Under your current **${dasha}** period, favorable Jupiter transits trigger auspicious developments for proposals, engagements, or deepened marital harmony in the upcoming quarters.
* **Key Advice:** Transparent, candid communication resolves minor emotional misunderstandings before they linger.

### 📿 Sacred Vedic Remedies:
1. **Shiva-Parvati Archana:** Offer clean water or milk to Lord Shiva on Mondays to invite profound relational peace.
2. **Panchakshari Mantra:** Chant *"Om Namah Shivaya"* 108 times daily in morning contemplation.
3. **Venusian Charity:** Donate white food items (sweets, rice, or milk) on Fridays to enhance beneficial Venusian vibrations.`;
      }
    }

    // 3. Money / Wealth / Finance / Debt / Property
    if (
      lower.includes('money') ||
      lower.includes('wealth') ||
      lower.includes('finance') ||
      lower.includes('paisa') ||
      lower.includes('dhan') ||
      lower.includes('karj') ||
      lower.includes('debt') ||
      lower.includes('property') ||
      lower.includes('पैसा') ||
      lower.includes('धन') ||
      lower.includes('आर्थिक') ||
      lower.includes('कर्ज') ||
      lower.includes('संपत्ति') ||
      lower.includes('मकान')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🪙
(जन्म स्थान: ${city} • ${lagna} लग्न • ${moon} चंद्र राशि)

आपकी जन्म पत्रिका के **द्वितीय भाव (धन संचय)** एवं **एकादश भाव (लाभ भाव)** का विश्लेषण करने पर, आपकी कुंडली में निरंतर उपार्जन और सुरक्षित परिसंपत्ति निर्माण के सुंदर योग हैं।

### 🔮 आर्थिक स्थिति व धन योग:
* **धन आगमन के स्रोत:** आपकी कुंडली में ज्ञान, तकनीकी कौशल और स्वतंत्र योग्यता के माध्यम से आय के एक से अधिक साधन विकसित होने के संकेत हैं।
* **वर्तमान दशा चक्र:** चल रही **${dasha}** के अंतर्गत आवेगी खर्चों और जोखिम भरे सट्टे से बचना आवश्यक है। नियोजित मासिक बचत आपके भविष्य को सुदृढ़ करेगी।
* **कर्जमुक्ति व संपत्ति योग:** इस वर्ष के उत्तरार्ध में रुके हुए धन की प्राप्ति और स्थायी संपत्ति (भूमि, वाहन या गृह) संबंधी योजनाओं में शुभ प्रगति होगी।

### 📿 स्थायी लक्ष्मी प्राप्ति हेतु वैदिक उपाय:
1. **कनकधारा / श्री सूक्तम:** प्रत्येक शुक्रवार की संध्या को शुद्ध घी का दीपक जलाकर कनकधारा स्तोत्र अथवा श्री सूक्तम का पाठ करें।
2. **उत्तर दिशा शुद्धि:** अपने निवास या कार्यस्थल की उत्तर दिशा को सदैव स्वच्छ, हल्का और सुगंधित रखें (यह कुबेर देव का स्थान है)।
3. **बुधवार गणेश उपाय:** बुधवार को गणेश जी को गुड़ और दूर्वा अर्पित करें।`;
      } else {
        return `Warm blessings **${name}**! 🪙
(Birth Details: ${city} • ${lagna} Lagna • ${moon} Moon)

Examining your **2nd House of Accumulated Wealth** and **11th House of Gains**, your chart indicates solid compounding potential and gradual prosperity through disciplined effort.

### 🔮 Financial Synthesis:
* **Wealth Streams:** Planetary configurations favor diversified, skill-based earning channels rather than speculative bets.
* **Period Focus:** During this **${dasha}** phase, prioritize debt clearance and asset consolidation.
* **Milestone Timing:** Positive planetary shifts in upcoming quarters favor recovery of stalled dues and real estate/asset creation.

### 📿 Vedic Prosperity Remedies:
1. **Sri Suktam:** Light a pure cow ghee lamp on Friday evenings and listen to or chant the Sri Suktam.
2. **Vastu Direction:** Maintain order and cleanliness in the Northern sector of your living space to optimize wealth energies.
3. **Charity on Wednesdays:** Donate green fruits or grains to someone in need.`;
      }
    }

    // 4. Health / Disease / Stress / Vitality / Ayurvedic Balance
    if (
      lower.includes('health') ||
      lower.includes('disease') ||
      lower.includes('stress') ||
      lower.includes('swasthya') ||
      lower.includes('rog') ||
      lower.includes('bimari') ||
      lower.includes('tanaav') ||
      lower.includes('स्वास्थ्य') ||
      lower.includes('रोग') ||
      lower.includes('बीमारी') ||
      lower.includes('तनाव') ||
      lower.includes('दवा')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🌿
(जन्म स्थान: ${city} • लग्न: ${lagna} • नक्षत्र: ${nakshatra})

वैदिक ज्योतिष में **षष्ठ भाव (रोग भाव)** और **लग्न भाव (आरोग्य भाव)** शारीरिक ऊर्जा और जीवनी शक्ति का प्रतिनिधित्व करते हैं। आपकी पत्रिका के अनुसार मौसमी बदलावों और मानसिक तनाव से शारीरिक संतुलन प्रभावित हो सकता है।

### 🔮 स्वास्थ्य एवं जीवनी शक्ति विश्लेषण:
* **संवेदनशील अंग:** पाचन तंत्र और स्नायु तंत्र (Nervous System) का विशेष ध्यान रखें। अत्यधिक चिंतन से पित्त या वात दोष में असंतुलन आ सकता है।
* **वर्तमान समय:** **${dasha}** की अवधि में नियमित दिनचर्या, पर्याप्त निद्रा और सात्विक आहार संजीवनी के समान कार्य करेगा।

### 📿 आरोग्य प्राप्ति हेतु वैदिक व आयुर्वेदिक उपाय:
1. **महामृत्युंजय जप:** प्रतिदिन प्रातः स्नान के उपरांत भगवान शिव के महामृत्युंजय मंत्र का 11 बार जप करें।
2. **सूर्य नमस्कार व प्राणायाम:** प्रातः 10 मिनट अनुलोम-विलोम प्राणायाम करें, इससे मस्तिष्क को नई शांति प्राप्त होगी।
3. **जल दान:** किसी चिकित्सालय अथवा सार्वजनिक स्थान पर जल की व्यवस्था या सेवा करें।`;
      } else {
        return `Warm blessings **${name}**! 🌿
(Birth Details: ${city} • ${lagna} Lagna • ${nakshatra} Nakshatra)

In Vedic medical astrology (Ayur-Jyotish), the **1st House (Lagna)** governs bodily prana, while the **6th House** governs immunity and digestive fire (Agni).

### 🔮 Health & Vitality Insights:
* **Key Focus:** Mindful care of your digestive rhythm and nervous energy. Excessive mental rumination can agitate constitutional balance.
* **Cycle Guidance:** Under your active **${dasha}** cycle, adhering to a grounded sleep schedule and warm, freshly prepared meals restores equilibrium.

### 📿 Sacred Restorative Remedies:
1. **Mahamrityunjaya Mantra:** Recite the sacred healing Mahamrityunjaya Mantra 11 times every morning with reverent calm.
2. **Pranayama:** Dedicate 10 minutes to deep diaphragmatic breathing and gentle solar exposure at sunrise.
3. **Compassionate Care:** Donate medicine or fresh drinking water to those in need.`;
      }
    }

    // 5. Foreign Travel / Abroad / Relocation / PR / Visa
    if (
      lower.includes('foreign') ||
      lower.includes('abroad') ||
      lower.includes('videsh') ||
      lower.includes('visa') ||
      lower.includes('travel') ||
      lower.includes('विदेश') ||
      lower.includes('यात्रा') ||
      lower.includes('वीजा') ||
      lower.includes('बाहर')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! ✈️
(जन्म स्थान: ${city} • ${lagna} लग्न • ${moon} चंद्र राशि)

वैदिक ज्योतिष में **द्वादश भाव (विदेश भाव)**, **नवम भाव (दूरस्थ यात्रा)** और **तृतीय भाव (यात्रा भाव)** विदेश गमन और दूरस्थ स्थानों में सफलता का निर्धारण करते हैं।

### 🔮 विदेश यात्रा एवं निवास योग:
* **विदेश गमन योग:** आपकी जन्म पत्रिका में द्वादश और नवम भाव के ग्रहों का शुभ संरेखण यह इंगित करता है कि अपनी जन्मभूमि ${city} से दूर अथवा विदेश में आपको उच्च मान-सम्मान और प्रगति प्राप्त होगी।
* **वीजा व औपचारिकताएं:** वर्तमान **${dasha}** की अवधि में आवश्यक दस्तावेजों की सावधानीपूर्वक तैयारी से वीजा अथवा अंतरराष्ट्रीय प्रोजेक्ट्स में शुभ समाचार मिलने के प्रबल संकेत हैं।

### 📿 विदेश यात्रा में सफलता हेतु उपाय:
1. **हनुमान जी की उपासना:** मंगलवार को हनुमान चालीसा का पाठ करें और सिंदूर का तिलक लगाएं।
2. **राहु-गुरु शांति:** भगवान विष्णु को पीले फूल अर्पित करें और गुरुवार को किसी मंदिर में धार्मिक पुस्तक अथवा अन्न दान करें।`;
      } else {
        return `Warm blessings **${name}**! ✈️
(Birth Details: ${city} • ${lagna} Ascendant)

In Vedic astrology, the **12th House of Foreign Lands**, **9th House of Long Journeys**, and **3rd House of Travel** govern overseas relocation and multinational endeavors.

### 🔮 Overseas & Travel Readings:
* **Foreign Prospects:** Planetary harmonics indicate strong propensities for flourishing away from your birthplace ${city}. Relocation or international clients bring noteworthy milestones.
* **Document Timing:** Under your current **${dasha}** phase, attention to regulatory details unlocks favorable visa approvals.

### 📿 Auspicious Vedic Remedies:
1. **Hanuman Chalisa:** Recite on Tuesdays and Saturdays for unhindered travel pathways.
2. **Charitable Offering:** Donate grains or books to students on Thursdays to balance the 9th and 12th houses.`;
      }
    }

    // 6. Doshas: Manglik, Sade Sati, Kaal Sarp, Pitra Dosha
    if (
      lower.includes('mangal') ||
      lower.includes('manglik') ||
      lower.includes('sade sati') ||
      lower.includes('kaal sarp') ||
      lower.includes('pitra') ||
      lower.includes('dosh') ||
      lower.includes('मंगल') ||
      lower.includes('मांगलिक') ||
      lower.includes('साढ़े साती') ||
      lower.includes('कालसर्प') ||
      lower.includes('दोष')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🛡️
(जन्म स्थान: ${city} • ${lagna} लग्न • ${nakshatra} नक्षत्र)

शास्त्रों में कहा गया है: *"ग्रहाधीनं जगत्सर्वं, ग्रहाधीना नराधिपाः"* अर्थात ग्रह प्रभाव डालते हैं, परंतु सचेत कर्म और वैदिक उपाय बड़े से बड़े दोष के प्रभाव को शून्य कर देते हैं।

### 🔮 ग्रह दोष व शांति विश्लेषण:
* **दोष का वास्तविक स्वरूप:** चाहे मांगलिक प्रभाव हो, साढ़े साती या कालसर्प, ये वास्तव में पूर्वजन्म के संस्कार हैं जो व्यक्ति को अनुशासित और परिपक्व बनाने आते हैं।
* **घबराने की आवश्यकता नहीं:** आपकी कुंडली में शुभ ग्रहों की अमृतमयी दृष्टि दोष के दुष्प्रभाव को अत्यंत क्षीण कर रही है।

### 📿 अचूक वैदिक निवारण उपाय:
1. **महामृत्युंजय / सुंदरकांड:** माह में एक बार सुंदरकांड का पाठ करें या शनिवार को महामृत्युंजय मंत्र जपें।
2. **पीपल पूजन:** शनिवार की संध्या पीपल वृक्ष में जल देकर 7 परिक्रमा करें और सरसों तेल का दीप जलाएं।
3. **गौ व श्वान सेवा:** शनिवार को काले कुत्ते को मीठी रोटी या बिस्कुट दें और गाय की सेवा करें।`;
      } else {
        return `Warm blessings **${name}**! 🛡️
(Birth Details: ${city} • ${lagna} Lagna • ${nakshatra} Nakshatra)

In classical Jyotish, planetary configurations termed "doshas" (Manglik, Sade Sati, Kaal Sarp) represent karmic lessons designed to forge spiritual maturity and resilience, not permanent curses.

### 🔮 Dosha Harmonization Insights:
* **Authentic Perspective:** Benefic planetary aspects in your chart substantially mitigate malefic tendencies. Fear is unnecessary when conscious remedies are applied.
* **Inner Discipline:** Maintaining integrity, emotional restraint, and compassion completely balances these energetic signatures.

### 📿 Calming Vedic Remedies:
1. **Sundarkand / Hanuman Worship:** Recite Hanuman Chalisa on Tuesdays and Saturdays for spiritual invincibility.
2. **Peepal Tree Offering:** Light an earthen mustard-oil lamp beneath a sacred Peepal tree on Saturday evenings.
3. **Animal Kindness:** Feed street animals or wild birds on Saturdays to harmonize karmic accounts.`;
      }
    }

    // 7. Gemstones (Ratna) & Rudraksha
    if (
      lower.includes('gemstone') ||
      lower.includes('stone') ||
      lower.includes('ratna') ||
      lower.includes('rudraksha') ||
      lower.includes('pukhraj') ||
      lower.includes('panna') ||
      lower.includes('moti') ||
      lower.includes('manik') ||
      lower.includes('neelam') ||
      lower.includes('रत्न') ||
      lower.includes('रुद्राक्ष') ||
      lower.includes('माणिक्य') ||
      lower.includes('पन्ना') ||
      lower.includes('पुखराज') ||
      lower.includes('मोती')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 💎
(जन्म स्थान: ${city} • ${lagna} लग्न • राशि: ${moon})

वैदिक ज्योतिष में रत्न सदैव लग्न, पंचम (विद्या/भाग्य) और नवम (धर्म/भाग्य) के त्रिकोण स्वामियों के अनुकूल ही धारण किए जाते हैं। कभी भी मारक या त्रिक भावों के रत्न धारण नहीं करने चाहिए।

### 🔮 रत्न व रुद्राक्ष परामर्श:
* **अनुकूल रत्न:** आपके **${lagna} लग्न** के अनुसार लग्नेश और भाग्येश के रत्न आपके शारीरिक बल, तेज और भाग्य को प्रज्वलित करेंगे।
* **रुद्राक्ष की महिमा:** किसी भी जातक के लिए **पंचमुखी रुद्राक्ष** अथवा **गौरी-शंकर रुद्राक्ष** धारण करना पूर्णतः निरापद और परम कल्याणकारी है।

### 📿 रत्न धारण के वैदिक नियम:
1. रत्न सदैव प्राकृतिक, दोषरहित और उचित धातु (सोना, चांदी अथवा पंचधातु) में प्राण-प्रतिष्ठा कराकर ही शुभ मुहूर्त में धारण करें।
2. रत्न धारण करने से पूर्व उस ग्रह के बीज मंत्र का 108 बार जप अवश्य करें।`;
      } else {
        return `Warm blessings **${name}**! 💎
(Birth Details: ${city} • ${lagna} Ascendant • ${moon} Moon)

In classical Vedic gemology (Ratna Shastra), gemstones must strictly fortify your benefic trine lords (1st, 5th, or 9th houses) and should never activate obstructive dusthana houses.

### 🔮 Gemstone & Rudraksha Guidance:
* **Chart Alignment:** For your **${lagna} Lagna**, energizing your primary Ascendant and Fortune lords fosters steady vitality, intellect, and good fortune.
* **Rudraksha:** Authentic 5-Mukhi Rudraksha or Gauri-Shankar Rudraksha is universally auspicious and safe for daily wear, bringing mental calm.

### 📿 Essential Rules:
1. Ensure stones are unheated, natural, and consecrated with appropriate planetary mantras on the corresponding weekday morning.`;
      }
    }

    // 8. General / Fallback Dynamic Consultation
    const generalResponsesHi = [
      `सादर प्रणाम **${name} जी**! 🙏
(जन्म स्थान: ${city} • लग्न: ${lagna} • चन्द्र राशि: ${moon} • नक्षत्र: ${nakshatra})

आपकी जन्म कुंडली का समग्र ढाँचा यह दर्शाता है कि आपका व्यक्तित्व गहन बौद्धिक संतुलन, विवेकपूर्ण दूरदर्शिता और उच्च सत्यनिष्ठा का अनुपम संगम है। वर्तमान में आप **${dasha}** महादशा के प्रभाव में हैं।

### 🌟 आज के लिए आपका ज्योतिषीय फलादेश:
* **आत्मिक ऊर्जा:** आपका **${lagna} लग्न** आपको परिस्थितियों का निष्पक्ष विश्लेषण करने की अद्भुत क्षमता प्रदान करता है। किसी भी बाहरी दबाव में अपने मूल सिद्धांतों से समझौता न करें।
* **समय का संदेश:** वर्तमान ग्रह गोचर आपकी आंतरिक क्षमताओं को निखारने और दीर्घकालिक प्राथमिकताओं को सुदृढ़ करने के लिए अत्यंत अनुकूल है।

### 📿 दैनिक शांति व भाग्योदय उपाय:
1. प्रातः स्नान के उपरांत गायत्री मंत्र का 11 बार एकाग्रचित्त होकर जप करें।
2. प्रतिदिन घर से निकलते समय माता-पिता व गुरुजनों का आशीर्वाद लें।
3. पक्षियों के लिए छत या बालकनी में जल का पात्र रखें।

आप अपने करियर, नौकरी, विवाह, व्यापार अथवा स्वास्थ्य के संबंध में कोई भी विशिष्ट प्रश्न पूछ सकते हैं। मैं आपकी सेवा में सदैव तत्पर हूँ।`,

      `सादर प्रणाम **${name} जी**! 🌟
(जन्म विवरण: ${city} • लग्न: ${lagna} • राशि: ${moon})

आपकी पत्रिका का सूक्ष्म अवलोकन करने पर ज्ञात होता है कि आपकी कुंडली में लग्न और चंद्र की शुभ स्थिति आपको विषम परिस्थितियों में भी शांत और धैर्यवान बनाए रखती है। वर्तमान **${dasha}** आपके जीवन में एक महत्वपूर्ण मोड़ का संकेत दे रही है।

### 🔮 मुख्य ज्योतिषीय अंतर्दृष्टि:
* **कर्म और भाग्य का संतुलन:** आपकी मेहनत कभी व्यर्थ नहीं जाएगी। जो योजनाएं लंबे समय से रुकी हुई थीं, उनमें अब शुभ प्रगति के लक्षण दिखाई देंगे।
* **सावधानी:** अपनी गुप्त योजनाओं को हर किसी से साझा न करें। जब तक कार्य पूर्ण न हो जाए, तब तक गोपनीयता बनाए रखना आपके लिए सर्वोत्तम रहेगा।

### 📿 कल्याणकारी दैनिक उपाय:
1. प्रतिदिन प्रातः भगवान सूर्य को अर्घ्य दें और *"ॐ नमः शिवाय"* का मन में स्मरण करें।
2. अपनी सामर्थ्य अनुसार जरूरतमंदों को अन्न या वस्त्र का दान करें।`
    ];

    const chosenGenHi = generalResponsesHi[varSeed % generalResponsesHi.length];
    if (isHi) return chosenGenHi;

    return `Warm blessings and Namaste **${name}**! 🙏
(Birth Details: ${city} • ${lagna} Ascendant • ${moon} Moon • ${nakshatra} Nakshatra)

Your personal Vedic birth chart reveals a resilient synthesis of deliberate intellect and deep emotional intuition. You are currently navigating the **${dasha}** planetary cycle.

### 🌟 Cosmic Guidance For You:
* **Inner Resilience:** Your **${lagna} Lagna** confers strategic clarity and steadfast endurance. Trust your authentic values when making major life decisions.
* **Current Phase Advice:** This cycle encourages consolidating your foundational assets, refining goals, and letting go of unwarranted anxieties.

### 📿 Daily Harmonizing Practices:
1. Recite the sacred Gayatri Mantra 11 times every morning with focused, tranquil breathing.
2. Seek the heartfelt blessings of elders and maintain quiet integrity in your daily dealings.
3. Feed birds or provide water in nature to harmonize universal prana.

Please feel free to ask about your career, marriage, finances, or specific astrological questions. I am here to guide you with complete dedication!`;
  }
}

export const vedicChatbotService = new VedicChatbotService();
