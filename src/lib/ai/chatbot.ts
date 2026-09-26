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

    // 2. Fallback to Built-in Astrological Reasoning Engine
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
    const focusArea = profile.problemCategory || 'General Life Guidance';

    const systemInstruction = `You are "आचार्य AstroVeda" (Acharya AstroVeda), an enlightened, compassionate, highly respected master Vedic Astrologer representing AstroVeda.
You hold deep mastery in Maharishi Parashara, Jaimini Sutras, and Bhrigu Nadi astrology.

You are conducting a private, premium consultation with:
- Client Name: ${name}
- Gender: ${profile.gender || 'Not specified'}
- Birth Details: Date: ${profile.birthDate || 'Known'}, Time: ${profile.birthTime || 'Known'}, Place: ${profile.birthCity || 'India'}
- Ascendant (लग्न): ${lagna}
- Moon Sign (चन्द्र राशि): ${moon}
- Sun Sign (सूर्य राशि): ${sun}
- Birth Nakshatra (नक्षत्र): ${nakshatra}
- Current Mahadasha / Cycle (वर्तमान दशा): ${dasha}
- Client Area of Interest / Concern: ${focusArea}

CONSULTATION GUIDELINES:
1. Greet the querent respectfully and warmly (e.g., "सादर प्रणाम ${name} जी" in Hindi or "Warm blessings and Namaste ${name}" in English).
2. Synthesize your astrological analysis specifically referencing their ${lagna} Lagna, ${moon} Moon Sign, 10th/7th/5th/2nd houses as relevant to their question, and their current ${dasha} planetary period.
3. Offer practical, sacred Vedic remedies:
   - Presiding Deity Worship / Stotram or Mantras (e.g., Mahamrityunjaya, Gayatri, Hanuman Chalisa, Sri Suktam)
   - Charitable Deeds / Daan (giving items related to afflicted planets on specific days)
   - Fasting / Auspicious colors and days
   - Gemstones or Rudraksha with ethical guidance and caveat
4. Tone: Grounded, spiritually uplifting, realistic, empathetic, and wise. DO NOT induce fear, fatalism, or doom. Emphasize that planets reveal tendencies, but conscious Karma, effort, and pure intent shape our life.
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
    const lagna = profile.lagna || 'Aries (मेष)';
    const moon = profile.moonSign || 'Scorpio (वृश्चिक)';
    const dasha = profile.currentDasha || 'राहु - बृहस्पति';
    const nakshatra = profile.nakshatra || 'रोहिणी';

    // 1. Career / Job / Promotion / Business
    if (
      lower.includes('career') ||
      lower.includes('job') ||
      lower.includes('business') ||
      lower.includes('work') ||
      lower.includes('नौकरी') ||
      lower.includes('करियर') ||
      lower.includes('व्यापार') ||
      lower.includes('प्रमोशन')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🌟

आपकी जन्म कुंडली में **${lagna} लग्न** और **${moon} राशि** का प्रभाव दशम भाव (कर्म भाव) को अत्यंत सक्रिय बनाता है। वर्तमान में आपकी चल रही **${dasha}** की दशा कर्मक्षेत्र में कुछ परिवर्तनों और नई जिम्मेदारियों का संकेत दे रही है।

### 🔮 ज्योतिषीय विश्लेषण:
* **दशम भाव की स्थिति:** सूर्य एवं शनि के प्रभाव से आपको मेहनत के उपरांत ही स्थायित्व प्राप्त होता है। जल्दबाजी में कार्यक्षेत्र में कोई बड़ा निर्णय न लें।
* **अनुकूल समय:** आने वाले 3 से 6 महीनों में ग्रह गोचर आपके पक्ष में आ रहा है, जिससे नई नौकरी या पदोन्नति के शुभ अवसर बनेंगे।
* **व्यापार/नौकरी मार्गदर्शन:** सरकारी क्षेत्र, आईटी, प्रबंधन या परामर्श से जुड़े कार्यों में विशेष सफलता के योग हैं।

### 📿 वैदिक उपाय एवं मार्गदर्शन:
1. **सूर्य अर्घ्य:** प्रतिदिन प्रातः तांबे के लोटे में जल, लाल चंदन और रोली डालकर भगवान सूर्य को अर्घ्य दें एवं *"ॐ घृणिः सूर्याय नमः"* का 11 बार जप करें।
2. **हनुमान उपासना:** मंगलवार व शनिवार को हनुमान चालीसा का पाठ करें।
3. **दान:** शनिवार को किसी जरूरतमंद को काले तिल या भोजन का दान करें।

निश्चिंत रहें, आपका पुरुषार्थ और सही समय का ग्रह गोचर आपको निश्चित सफलता दिलाएगा। यदि कोई विशिष्ट प्रश्न है, तो अवश्य पूछें।`;
      } else {
        return `Warm blessings **${name}**! 🌟

Looking at your Vedic birth chart with **${lagna} Ascendant** and **${moon} Moon Sign**, your 10th house of career and professional karma is undergoing a transformative transition under your current **${dasha}** planetary cycle.

### 🔮 Astrological Insights:
* **10th House Influences:** The planetary alignments indicate that sustained perseverance will bring long-lasting stability rather than quick shortcuts.
* **Favorable Timing:** An auspicious planetary transit opens up between the next 3 to 6 months, bringing strong possibilities for promotion, role shifts, or venture growth.
* **Career Direction:** Areas involving advisory roles, technology, strategic execution, or administration are strongly supported.

### 📿 Recommended Vedic Remedies:
1. **Surya Arghya:** Offer water to the rising Sun daily from a copper vessel with a pinch of red kumkum, chanting *"Om Ghrinih Suryaya Namah"*.
2. **Hanuman Chalisa:** Recite the Hanuman Chalisa on Tuesdays and Saturdays for mental strength and overcoming workplace obstacles.
3. **Charity (Daan):** Support underprivileged workers or feed birds on Saturdays to balance Saturnian energies.

Please feel free to ask about any specific date, interview, or business decision!`;
      }
    }

    // 2. Marriage / Love / Relationship
    if (
      lower.includes('marriage') ||
      lower.includes('love') ||
      lower.includes('relationship') ||
      lower.includes('shadi') ||
      lower.includes('vivah') ||
      lower.includes('विवाह') ||
      lower.includes('शादी') ||
      lower.includes('प्रेम') ||
      lower.includes('संबंध')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🌸

आपकी कुंडली में **${lagna} लग्न** और सप्तम भाव (विवाह व दांपत्य भाव) पर दृष्टि डालने पर, शुक्र और गुरु की स्थिति प्रेम और विवाह में निष्ठा और परिपक्वता की मांग करती है।

### 🔮 दांपत्य एवं प्रेम विश्लेषण:
* **सप्तम भाव का प्रभाव:** आपके जीवनसाथी समझदार, स्वाभिमानी और पारिवारिक मूल्यों का आदर करने वाले होंगे।
* **विवाह के शुभ योग:** वर्तमान **${dasha}** के अंतर्गत देवगुरु बृहस्पति का अनुकूल गोचर आगामी महीनों में विवाह संबंधी वार्ताओं में सफलता के मजबूत योग बना रहा है।
* **सावधानी:** क्रोध या अति-अपेक्षाओं के कारण संबंधों में अनावश्यक तनाव से बचें।

### 📿 सुखी वैवाहिक जीवन हेतु उपाय:
1. **गौरी-शंकर उपासना:** प्रत्येक सोमवार को शिवलिंग पर जल और कच्चा दूध अर्पित करें तथा माता पार्वती को सिंदूर चढ़ाएं।
2. **मंत्र जप:** प्रतिदिन *"ॐ नमः शिवाय"* का 108 बार मानसिक जप करें।
3. **गौ सेवा:** शुक्रवार के दिन गाय को हरा चारा या आटे की लोई में गुड़ रखकर खिलाएं।`;
      } else {
        return `Warm blessings **${name}**! 🌸

In your Vedic chart with **${lagna} Ascendant** and **${moon} Moon**, the 7th house governing marriage and sacred partnerships is shaped by Venusian and Jupiterian harmonics.

### 🔮 Relationship & Marriage Reading:
* **Spouse Characteristics:** Planetary dynamics indicate a loyal, intellectually grounded, and self-respecting life partner who values family unity.
* **Auspicious Timing:** Under your current **${dasha}** cycle, favorable transits of Jupiter indicate fruitful proposals and relationship harmony in the upcoming quarters.
* **Key Advice:** Maintain open communication and mutual patience during emotional transitions.

### 📿 Sacred Vedic Remedies:
1. **Shiva-Parvati Archana:** Offer clean water or milk to Lord Shiva on Mondays to invite marital peace and harmonious companionship.
2. **Mantra:** Chant *"Om Namah Shivaya"* 108 times daily in the morning or evening.
3. **Friday Offering:** Donate white sweets or feed a cow on Fridays to strengthen beneficial Venusian vibrations.`;
      }
    }

    // 3. Money / Wealth / Finance / Debt
    if (
      lower.includes('money') ||
      lower.includes('wealth') ||
      lower.includes('finance') ||
      lower.includes('paisa') ||
      lower.includes('dhan') ||
      lower.includes('कर्ज') ||
      lower.includes('पैसा') ||
      lower.includes('धन') ||
      lower.includes('आर्थिक')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🪙

आपकी कुंडली के धन भाव (द्वितीय भाव) और लाभ भाव (एकादश भाव) का विश्लेषण करने पर, **${lagna} लग्न** के अनुसार धन संचय में निरंतर वृद्धि के योग हैं, परंतु खर्चों पर नियंत्रण रखना आवश्यक है।

### 🔮 आर्थिक स्थिति का विश्लेषण:
* **धन योग:** आपकी कुंडली में धन प्राप्ति के स्रोत एक से अधिक हो सकते हैं। ज्ञान, कौशल और दीर्घकालिक निवेश से अच्छा लाभ प्राप्त होगा।
* **वर्तमान दशा का प्रभाव:** **${dasha}** में अनावश्यक लेन-देन और बिना सोचे-समझे किए गए निवेश से बचें।
* **सुधार का समय:** इस वर्ष के उत्तरार्ध में धन प्रवाह में स्पष्ट स्थिरता और ऋणमुक्ति के रास्ते खुलेंगे।

### 📿 धन वृद्धि हेतु वैदिक उपाय:
1. **श्री सूक्तम:** शुक्रवार की संध्या को घी का दीपक जलाकर कनकधारा स्तोत्र या श्री सूक्तम का पाठ करें।
2. **बुधवार का उपाय:** बुधवार को गणेश जी को 21 दूर्वा अर्पित करें और *"ॐ गं गणपतये नमः"* का जप करें।
3. **आशीर्वाद:** अपने घर की उत्तर दिशा को सदैव स्वच्छ और अवरोध-मुक्त रखें।`;
      } else {
        return `Warm blessings **${name}**! 🪙

Examining your 2nd house of accumulated wealth and 11th house of gains for your **${lagna} Ascendant**, your financial blueprint emphasizes systematic accumulation and disciplined asset growth.

### 🔮 Financial Synthesis:
* **Wealth Accumulation:** Your chart indicates diversified earning potential through skill-driven and knowledge-based avenues.
* **Current Period Impact:** During this **${dasha}** phase, prioritize debt consolidation and avoid speculative high-risk risks.
* **Favorable Turn:** Steady compounding and recovery of stalled resources are supported in the upcoming planetary cycles.

### 📿 Vedic Prosperity Remedies:
1. **Sri Suktam / Kanakadhara:** Light a pure ghee lamp on Friday evenings and listen to or recite the Sri Suktam for divine abundance.
2. **Ganesha Archana:** Offer fresh green grass (Durva) to Lord Ganesha on Wednesdays and chant *"Om Gam Ganapataye Namaha"*.
3. **Vastu Alignment:** Keep the North and Northeast sectors of your home or workspace clutter-free to facilitate cosmic prana.`;
      }
    }

    // 4. Sade Sati / Shani / Dasha / Rahu-Ketu
    if (
      lower.includes('shani') ||
      lower.includes('sade sati') ||
      lower.includes('dasha') ||
      lower.includes('rahu') ||
      lower.includes('ketu') ||
      lower.includes('शनि') ||
      lower.includes('साढ़े साती') ||
      lower.includes('दशा') ||
      lower.includes('राहु') ||
      lower.includes('केतु')
    ) {
      if (isHi) {
        return `सादर प्रणाम **${name} जी**! 🪐

ग्रहों के न्यायधीश भगवान शनिदेव और छाया ग्रह राहु-केतु किसी को कष्ट देने नहीं, अपितु आत्मा को तपाकर कुंदन बनाने आते हैं।

### 🔮 ग्रह दशा एवं साढ़े साती विश्लेषण:
* **वर्तमान महादशा:** आपकी चल रही **${dasha}** आपको जीवन के वास्तविक सत्यों, आत्म-अनुशासन और धैर्य की परीक्षा ले रही है।
* **चंद्र राशि प्रभाव:** आपकी **${moon} राशि** के संदर्भ में शनि का गोचर कर्म को शुद्ध करने की प्रेरणा देता है। जो लोग सत्य और ईमानदारी के मार्ग पर चलते हैं, शनिदेव उन्हें अपार यश और स्थायित्व प्रदान करते हैं।

### 📿 शनि व राहु शांति के सरल उपाय:
1. **शनि दीप दान:** प्रत्येक शनिवार की संध्या को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।
2. **हनुमान चालीसा / सुंदरकांड:** शनिवार को सुंदरकांड या 3 बार हनुमान चालीसा का पाठ करें (हनुमान जी के भक्तों पर शनि व राहु का कोई कुप्रभाव नहीं पड़ता)।
3. **सेवा भाव:** सफाई कर्मचारियों, दिव्यांगों या श्रमिकों का सदैव सम्मान करें और उन्हें यथासंभव भोजन व वस्त्र प्रदान करें।`;
      } else {
        return `Warm blessings **${name}**! 🪐

In Vedic wisdom, Saturn (Shani Bhagwan) and Rahu-Ketu act as cosmic judges and deep teachers of our soul's destiny, refining our character through patience and integrity.

### 🔮 Dasha & Saturnian Analysis:
* **Current Cycle:** Your active **${dasha}** period prompts deep introspection, disciplined routines, and shedding illusory distractions.
* **Moon Sign Harmonization:** In relation to your **${moon} Moon**, planetary influences remind you to avoid procrastination and uphold complete transparency in your words and commitments.

### 📿 Calming Vedic Remedies:
1. **Saturday Peepal Lamp:** Light a mustard-oil earthen lamp beneath a Peepal tree on Saturday evenings.
2. **Hanuman Chalisa:** Recite the Hanuman Chalisa on Tuesdays and Saturdays. In Vedic tradition, sincere devotees of Lord Hanuman are blessed with grace and liberation from astrological anxieties.
3. **Compassionate Service:** Treat service workers, laborers, and elders with warmth, offering food or clothing on Saturdays.`;
      }
    }

    // 5. Default General Consultation
    if (isHi) {
      return `सादर प्रणाम **${name} जी**! 🙏

आपकी जन्म कुंडली का समग्र स्वरूप **${lagna} लग्न** और **${moon} राशि** के साथ **${nakshatra} नक्षत्र** द्वारा संचालित है। वर्तमान में आप **${dasha}** की महत्वपूर्ण दशा अवधि से गुजर रहे हैं।

### 🌟 आज के लिए आपका ज्योतिषीय मार्गदर्शन:
* **आत्मबल एवं मनःस्थिति:** आपका लग्न आपको स्वाभाविक अंतर्दृष्टि और विवेक प्रदान करता है। किसी भी परिस्थिति में अपने सिद्धांतों से समझौता न करें।
* **वर्तमान समय का संदेश:** यह समय आंतरिक क्षमताओं को निखारने, योजनाओं को व्यवस्थित करने और अनावश्यक मानसिक चिंताओं को त्यागने का है।

### 📿 दैनिक शांति उपाय:
1. प्रातः स्नान के उपरांत गायत्री मंत्र का 11 बार एकाग्रचित्त होकर जप करें।
2. प्रतिदिन माता-पिता व गुरुजनों का आशीर्वाद लेकर ही किसी महत्वपूर्ण कार्य का आरंभ करें।

आप अपने करियर, विवाह, स्वास्थ्य या किसी विशिष्ट समस्या के संबंध में कोई भी प्रश्न बेझिझक पूछ सकते हैं। मैं आपकी सेवा में उपस्थित हूँ।`;
    } else {
      return `Warm blessings and Namaste **${name}**! 🙏

Your Vedic birth chart reveals an insightful synthesis of **${lagna} Ascendant**, **${moon} Moon Sign**, and the spiritual grace of **${nakshatra} Nakshatra**. You are presently traversing the **${dasha}** planetary cycle.

### 🌟 Cosmic Guidance For You:
* **Inner Resilience:** Your Lagna imparts strategic intellect and perseverance. Trust your intuitive perception when evaluating life choices.
* **Current Cycle Advice:** This phase encourages consolidating your core strengths, maintaining emotional composure, and letting go of unnecessary apprehensions.

### 📿 Daily Harmonizing Practices:
1. Recite the sacred Gayatri Mantra 11 times every morning with a peaceful breath.
2. Seek the heartfelt blessings of your parents and elders before embarking on new tasks.

Please feel free to ask about your career, marriage prospects, financial growth, or remedies for specific life challenges. I am here to guide you with complete Vedic sincerity!`;
    }
  }
}

export const vedicChatbotService = new VedicChatbotService();
