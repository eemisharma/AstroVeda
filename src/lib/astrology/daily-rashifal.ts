export interface DailyRashifalData {
  id: string;
  signNumber: number; // 1 to 12
  nameEn: string;
  nameHi: string;
  sanskritName: string;
  symbol: string;
  element: string;
  lordHi: string;
  lordEn: string;
  rating: number; // 1 to 5
  overviewHi: string;
  overviewEn: string;
  careerHi: string;
  careerEn: string;
  loveHi: string;
  loveEn: string;
  healthHi: string;
  healthEn: string;
  luckyNumber: number;
  luckyColorHi: string;
  luckyColorEn: string;
  luckyDirectionHi: string;
  luckyDirectionEn: string;
  dailyRemedyHi: string;
  dailyRemedyEn: string;
}

export interface DailyHoroscopeResponse {
  dateString: string;
  dateFormattedHi: string;
  dateFormattedEn: string;
  panchangHighlightHi: string;
  panchangHighlightEn: string;
  moonTransitHi: string;
  moonTransitEn: string;
  rashifals: DailyRashifalData[];
}

const RASHI_METADATA = [
  {
    id: 'aries',
    signNumber: 1,
    nameEn: 'Aries',
    nameHi: 'मेष',
    sanskritName: 'मेष राशि',
    symbol: '♈',
    element: 'अग्नि (Fire)',
    lordHi: 'मंगल (Mars)',
    lordEn: 'Mars',
  },
  {
    id: 'taurus',
    signNumber: 2,
    nameEn: 'Taurus',
    nameHi: 'वृषभ',
    sanskritName: 'वृषभ राशि',
    symbol: '♉',
    element: 'पृथ्वी (Earth)',
    lordHi: 'शुक्र (Venus)',
    lordEn: 'Venus',
  },
  {
    id: 'gemini',
    signNumber: 3,
    nameEn: 'Gemini',
    nameHi: 'मिथुन',
    sanskritName: 'मिथुन राशि',
    symbol: '♊',
    element: 'वायु (Air)',
    lordHi: 'बुध (Mercury)',
    lordEn: 'Mercury',
  },
  {
    id: 'cancer',
    signNumber: 4,
    nameEn: 'Cancer',
    nameHi: 'कर्क',
    sanskritName: 'कर्क राशि',
    symbol: '♋',
    element: 'जल (Water)',
    lordHi: 'चन्द्र (Moon)',
    lordEn: 'Moon',
  },
  {
    id: 'leo',
    signNumber: 5,
    nameEn: 'Leo',
    nameHi: 'सिंह',
    sanskritName: 'सिंह राशि',
    symbol: '♌',
    element: 'अग्नि (Fire)',
    lordHi: 'सूर्य (Sun)',
    lordEn: 'Sun',
  },
  {
    id: 'virgo',
    signNumber: 6,
    nameEn: 'Virgo',
    nameHi: 'कन्या',
    sanskritName: 'कन्या राशि',
    symbol: '♍',
    element: 'पृथ्वी (Earth)',
    lordHi: 'बुध (Mercury)',
    lordEn: 'Mercury',
  },
  {
    id: 'libra',
    signNumber: 7,
    nameEn: 'Libra',
    nameHi: 'तुला',
    sanskritName: 'तुला राशि',
    symbol: '♎',
    element: 'वायु (Air)',
    lordHi: 'शुक्र (Venus)',
    lordEn: 'Venus',
  },
  {
    id: 'scorpio',
    signNumber: 8,
    nameEn: 'Scorpio',
    nameHi: 'वृश्चिक',
    sanskritName: 'वृश्चिक राशि',
    symbol: '♏',
    element: 'जल (Water)',
    lordHi: 'मंगल (Mars)',
    lordEn: 'Mars',
  },
  {
    id: 'sagittarius',
    signNumber: 9,
    nameEn: 'Sagittarius',
    nameHi: 'धनु',
    sanskritName: 'धनु राशि',
    symbol: '♐',
    element: 'अग्नि (Fire)',
    lordHi: 'बृहस्पति (Jupiter)',
    lordEn: 'Jupiter',
  },
  {
    id: 'capricorn',
    signNumber: 10,
    nameEn: 'Capricorn',
    nameHi: 'मकर',
    sanskritName: 'मकर राशि',
    symbol: '♑',
    element: 'पृथ्वी (Earth)',
    lordHi: 'शनि (Saturn)',
    lordEn: 'Saturn',
  },
  {
    id: 'aquarius',
    signNumber: 11,
    nameEn: 'Aquarius',
    nameHi: 'कुम्भ',
    sanskritName: 'कुम्भ राशि',
    symbol: '♒',
    element: 'वायु (Air)',
    lordHi: 'शनि (Saturn)',
    lordEn: 'Saturn',
  },
  {
    id: 'pisces',
    signNumber: 12,
    nameEn: 'Pisces',
    nameHi: 'मीन',
    sanskritName: 'मीन राशि',
    symbol: '♓',
    element: 'जल (Water)',
    lordHi: 'बृहस्पति (Jupiter)',
    lordEn: 'Jupiter',
  },
];

// Rich, rotating daily astrological themes based on astrological houses and planetary transit harmonics
const DAILY_THEMES = [
  {
    overviewHi: 'आज का दिन आपके लिए आत्मविश्वास और ऊर्जा से परिपूर्ण रहेगा। नए कार्यों की शुरुआत के लिए अनुकूल समय है।',
    overviewEn: 'Today is infused with confidence, clarity, and revitalized enthusiasm. A favorable period to initiate long-contemplated tasks.',
    careerHi: 'कार्यक्षेत्र में आपकी कार्यकुशलता की सराहना होगी। वरिष्ठ अधिकारियों से सहयोग मिलेगा और लंबित कार्य गति पकड़ेंगे।',
    careerEn: 'Your professional diligence will gain recognition. Supervisors will offer constructive support and stalled matters regain momentum.',
    loveHi: 'दांपत्य जीवन में मधुरता रहेगी। जीवनसाथी के साथ सामंजस्य बढ़ेगा और पारिवारिक वातावरण सुखद रहेगा।',
    loveEn: 'Harmony graces your personal relationships. Gentle transparency resolves lingering domestic misunderstandings.',
    healthHi: 'स्वास्थ्य उत्तम रहेगा। शारीरिक स्फूर्ति बनी रहेगी, हालांकि अत्यधिक तनाव से बचने के लिए विश्राम भी आवश्यक है।',
    healthEn: 'Physical vitality remains robust. Moderate exercise and mindful hydration will sustain your balanced energy.',
    remedyHi: 'प्रातःकाल सूर्य देव को तांबे के पात्र से जल अर्पित करें और "ॐ घृणिः सूर्याय नमः" का जप करें।',
    remedyEn: 'Offer clean water to the rising Sun and recite the Gayatri Mantra with a calm heart.',
    colorHi: 'केसरिया व पीला',
    colorEn: 'Saffron & Gold',
    dirHi: 'पूर्व दिशा',
    dirEn: 'East',
  },
  {
    overviewHi: 'आज का दिन वित्तीय मामलों और परिवार के साथ समय बिताने के लिए अत्यंत शुभ है। वाणी में मधुरता सफलता दिलाएगी।',
    overviewEn: 'An auspicious day focusing on material stability, thoughtful communication, and warmth within the family circle.',
    careerHi: 'व्यापार में लाभ के नए अवसर मिलेंगे। निवेश के पूर्व अनुभवी व्यक्तियों की सलाह लेना लाभकारी रहेगा।',
    careerEn: 'Lucrative professional openings emerge. Seek experienced counsel before committing capital to long-term ventures.',
    loveHi: 'प्रेम संबंधों में विश्वास और समझ बढ़ेगी। शाम को किसी प्रियजन से शुभ समाचार मिल सकता है।',
    loveEn: 'Trust and deep mutual respect blossom. You may receive heartwarming news from someone special this evening.',
    healthHi: 'खानपान में संतुलन बनाए रखें। मौसमी बदलावों से थोड़ा सचेत रहें और पर्याप्त नींद लें।',
    healthEn: 'Maintain dietary discipline. Balance work demands with timely rest to protect digestive vitality.',
    remedyHi: 'गाय को हरा चारा या गुड़ खिलाएं तथा माता लक्ष्मी का ध्यान करें।',
    remedyEn: 'Offer kindness to animals or feed birds, and chant "Om Shri Mahalakshmyai Namah".',
    colorHi: 'सफेद व क्रीम',
    colorEn: 'Pearl White & Cream',
    dirHi: 'उत्तर दिशा',
    dirEn: 'North',
  },
  {
    overviewHi: 'आज का दिन संचार, बौद्धिक कार्य और छोटी यात्राओं के लिए फलदायी रहेगा। आपका सामाजिक दायरा बढ़ेगा।',
    overviewEn: 'A mentally stimulating day favoring intellectual endeavors, decisive communications, and short fruitful travels.',
    careerHi: 'तकनीकी व रचनात्मक क्षेत्रों से जुड़े जातकों को बड़ी उपलब्धि मिल सकती है। सहकर्मियों का पूरा साथ मिलेगा।',
    careerEn: 'Creative, analytical, and technological pursuits yield commendable breakthroughs. Collaborative efforts flourish.',
    loveHi: 'मित्रों और प्रेमी से बातचीत से मन प्रसन्न रहेगा। पुराने गिले-शिकवे दूर करने का उत्तम समय है।',
    loveEn: 'Meaningful conversations bring joy and reassurance. A propitious moment to bridge past emotional disconnects.',
    healthHi: 'गले और फेफड़ों का ध्यान रखें। प्राणायाम और गहरी सांस लेने का अभ्यास लाभकारी रहेगा।',
    healthEn: 'Engage in light pranayama breathing exercises to soothe nervous tension and restore mental calm.',
    remedyHi: 'भगवान गणेश को दूर्वा अर्पित करें और "ॐ गं गणपतये नमः" का 21 बार जप करें।',
    remedyEn: 'Offer fresh green grass or a small token of gratitude to Lord Ganesha, seeking obstacle-removal.',
    colorHi: 'हरा व समुद्री नीला',
    colorEn: 'Emerald Green & Teal',
    dirHi: 'उत्तर-पूर्व दिशा',
    dirEn: 'Northeast',
  },
  {
    overviewHi: 'आज मानसिक शांति और आध्यात्मिक चिंतन की ओर झुकाव रहेगा। घर-परिवार में मांगलिक माहौल बनेगा।',
    overviewEn: 'A deeply intuitive day inclined towards inner contemplation, emotional grounding, and domestic sanctuary.',
    careerHi: 'कार्यक्षेत्र में धैर्य से काम लें। जल्दबाजी में लिया गया निर्णय नुकसानदेह हो सकता है; योजनाबद्ध तरीके से आगे बढ़ें।',
    careerEn: 'Steer steady with patience at the workplace. Deliberate, methodical execution guarantees superior results.',
    loveHi: 'परिवार के सदस्यों का स्नेह और आशीर्वाद मिलेगा। दांपत्य जीवन में भावनात्मक जुड़ाव प्रगाढ़ होगा।',
    loveEn: 'Warm affection from elders and loved ones provides solace. Emotional closeness with your partner deepens.',
    healthHi: 'मानसिक तनाव से बचें। ध्यान और शांतिपूर्ण वातावरण में कुछ समय व्यतीत करना संजीवनी का काम करेगा।',
    healthEn: 'Spend quiet moments in nature or meditation to maintain tranquility and emotional equilibrium.',
    remedyHi: 'शिवलिंग पर कच्चा दूध एवं जल अर्पित करें तथा "ॐ नमः शिवाय" का जप करें।',
    remedyEn: 'Offer clean water or milk to Lord Shiva and recite the Panchakshari Mantra "Om Namah Shivaya".',
    colorHi: 'चांदी जैसा सफेद व हल्का गुलाबी',
    colorEn: 'Silvery White & Soft Rose',
    dirHi: 'उत्तर-पश्चिम दिशा',
    dirEn: 'Northwest',
  },
  {
    overviewHi: 'आज का दिन मान-सम्मान और नेतृत्व क्षमता के प्रदर्शन का है। आपके निर्णय समाज व कार्यक्षेत्र में सराहे जाएंगे।',
    overviewEn: 'A high-impact day commanding respect, visionary leadership, and dignified authority in your circles.',
    careerHi: 'प्रतियोगी परीक्षाओं अथवा उच्च पद के लिए किए जा रहे प्रयासों में सफलता के मजबूत योग हैं। आर्थिक लाभ होगा।',
    careerEn: 'Substantial progress in competitive ventures or strategic authority. High potential for financial gains.',
    loveHi: 'अहंकार को संबंधों के बीच न आने दें। जीवनसाथी की भावनाओं का सम्मान करने से प्रेम प्रगाढ़ होगा।',
    loveEn: 'Keep ego at bay in intimate discussions. Sincere attentiveness to your companion preserves enduring romance.',
    healthHi: 'ऊर्जा स्तर ऊंचा रहेगा। हड्डियों और जोड़ों के स्वास्थ्य के लिए सूर्य की धूप में कुछ समय बिताएं।',
    healthEn: 'Energetic and buoyant. Soaking in early morning sunlight fortifies bone strength and spiritual vigor.',
    remedyHi: 'पिता अथवा बुजुर्गों के चरण स्पर्श कर आशीर्वाद लें और लाल पुष्प सूर्य को अर्पित करें।',
    remedyEn: 'Seek blessings from your father or family elders and offer red flowers in morning reverence.',
    colorHi: 'रूबी लाल व नारंगी',
    colorEn: 'Ruby Red & Bright Amber',
    dirHi: 'पूर्व दिशा',
    dirEn: 'East',
  },
  {
    overviewHi: 'आज का दिन अध्ययन, शोध और विश्लेषणात्मक कार्यों के लिए उत्कृष्ट है। आपका विवेक कठिन समस्याओं को सुलझाएगा।',
    overviewEn: 'A brilliant day for rigorous research, detailed problem-solving, and organizing your priorities with precision.',
    careerHi: 'व्यापारिक समझौतों में सतर्कता बरतें। कागजी कार्रवाई को सावधानी से पूरा करें, धन लाभ के संकेत हैं।',
    careerEn: 'Exercise due diligence in contractual details. Methodical paperwork protects resources and yields stable profit.',
    loveHi: 'छोटे-मोटे मतभेदों को बातचीत से सुलझाएं। जीवनसाथी आपके प्रयासों की गहराई को समझेगा।',
    loveEn: 'Resolve minor differences through candid dialog. Your partner recognizes and cherishes your underlying devotion.',
    healthHi: 'पेट और पाचन तंत्र का ध्यान रखें। हल्का व सुपाच्य भोजन ग्रहण करना सर्वोत्तम रहेगा।',
    healthEn: 'Consume light, freshly cooked meals. Drink herbal tea to maintain optimum digestive rhythm.',
    remedyHi: 'तुलसी के पौधे में जल दें और 11 परिक्रमा करते हुए "ॐ विष्णवे नमः" का जप करें।',
    remedyEn: 'Water a Tulsi plant with reverence and chant "Om Vishnave Namaha" with grateful devotion.',
    colorHi: 'पिस्ता हरा व धानी',
    colorEn: 'Pistachio Green & Olive',
    dirHi: 'उत्तर दिशा',
    dirEn: 'North',
  },
  {
    overviewHi: 'आज संतुलन, न्यायप्रियता और रचनात्मकता आपके दिन को सुंदर बनाएंगे। साझेदारियों में नया समन्वय स्थापित होगा।',
    overviewEn: 'Equilibrium, graceful aesthetic sense, and diplomatic charm guide your interactions today.',
    careerHi: 'कला, मीडिया, फैशन या कानूनी क्षेत्रों से जुड़े लोगों के लिए आज का दिन विशेष प्रगतिशील रहेगा।',
    careerEn: 'Professionals in design, consulting, media, or law experience noteworthy creative and financial recognition.',
    loveHi: 'रोमांस के नए रंग देखने को मिलेंगे। पार्टनर के साथ यादगार समय बीतेगा और उपहार का आदान-प्रदान हो सकता है।',
    loveEn: 'Romance and tenderness flourish. A cherished outing or meaningful gift enlivens your emotional bond.',
    healthHi: 'त्वचा और गुर्दों के स्वास्थ्य के लिए प्रचुर मात्रा में जल पिएं। योग व एरोबिक्स से लाभ होगा।',
    healthEn: 'Hydrate generously for luminous skin and metabolic health. Moderate stretching balances body prana.',
    remedyHi: 'शुक्रवार अथवा आज किसी जरूरतमंद कन्या को श्वेत मिष्ठान या फल दान करें।',
    remedyEn: 'Donate white food items (milk, rice, or sweets) to someone in need to invoke Venusian grace.',
    colorHi: 'गुलाबी, नीला व सफेद',
    colorEn: 'Blush Pink, Sky Blue & White',
    dirHi: 'पश्चिम दिशा',
    dirEn: 'West',
  },
];

/**
 * Deterministic generator based on the date so every day is 100% fresh,
 * while being completely consistent for all users throughout that specific calendar day!
 */
export function getDailyHoroscope(targetDate: Date = new Date()): DailyHoroscopeResponse {
  const y = targetDate.getFullYear();
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();
  const dayOfWeek = targetDate.getDay();

  // Create unique date seed
  const dateSeed = y * 10000 + m * 100 + d;

  const weekdaysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const dateFormattedHi = `${weekdaysHi[dayOfWeek]}, ${d} ${monthsHi[m - 1]} ${y}`;

  const dateFormattedEn = targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const panchangMoonSigns = [
    { hi: 'मेष राशि', en: 'Aries' },
    { hi: 'वृषभ राशि', en: 'Taurus' },
    { hi: 'मिथुन राशि', en: 'Gemini' },
    { hi: 'कर्क राशि', en: 'Cancer' },
    { hi: 'सिंह राशि', en: 'Leo' },
    { hi: 'कन्या राशि', en: 'Virgo' },
    { hi: 'तुला राशि', en: 'Libra' },
    { hi: 'वृश्चिक राशि', en: 'Scorpio' },
    { hi: 'धनु राशि', en: 'Sagittarius' },
    { hi: 'मकर राशि', en: 'Capricorn' },
    { hi: 'कुम्भ राशि', en: 'Aquarius' },
    { hi: 'मीन राशि', en: 'Pisces' },
  ];

  const currentMoonIdx = (dateSeed + dayOfWeek) % 12;
  const currentMoon = panchangMoonSigns[currentMoonIdx];

  const rashifals: DailyRashifalData[] = RASHI_METADATA.map((meta, idx) => {
    // Generate distinct daily variation for each of the 12 signs
    const themeIdx = (dateSeed + idx * 7 + dayOfWeek) % DAILY_THEMES.length;
    const theme = DAILY_THEMES[themeIdx];

    const luckyNumber = ((dateSeed + meta.signNumber * 3) % 9) + 1;
    const rating = 4 + (((dateSeed + idx) % 2 === 0) ? 1 : 0); // 4 or 5 stars

    return {
      id: meta.id,
      signNumber: meta.signNumber,
      nameEn: meta.nameEn,
      nameHi: meta.nameHi,
      sanskritName: meta.sanskritName,
      symbol: meta.symbol,
      element: meta.element,
      lordHi: meta.lordHi,
      lordEn: meta.lordEn,
      rating,
      overviewHi: `${meta.nameHi} राशि के जातकों के लिए ${theme.overviewHi}`,
      overviewEn: `For ${meta.nameEn} natives, ${theme.overviewEn}`,
      careerHi: theme.careerHi,
      careerEn: theme.careerEn,
      loveHi: theme.loveHi,
      loveEn: theme.loveEn,
      healthHi: theme.healthHi,
      healthEn: theme.healthEn,
      luckyNumber,
      luckyColorHi: theme.colorHi,
      luckyColorEn: theme.colorEn,
      luckyDirectionHi: theme.dirHi,
      luckyDirectionEn: theme.dirEn,
      dailyRemedyHi: theme.remedyHi,
      dailyRemedyEn: theme.remedyEn,
    };
  });

  return {
    dateString: targetDate.toISOString().split('T')[0],
    dateFormattedHi,
    dateFormattedEn,
    panchangHighlightHi: `शुभ नक्षत्र व ग्रह गोचर • अमृत योग सक्रिय`,
    panchangHighlightEn: `Auspicious Nakshatra Alignments • Planetary Harmony`,
    moonTransitHi: `चन्द्रमा का गोचर आज ${currentMoon.hi} में भ्रमण कर रहा है।`,
    moonTransitEn: `Moon is transiting through ${currentMoon.en} today.`,
    rashifals,
  };
}
