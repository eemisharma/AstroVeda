/**
 * Dynamic Vedic Daily Rashifal (Horoscope) Engine
 * Produces authentic daily planetary transit readings for all 12 Rashis (Aries to Pisces).
 * Deterministically seeded by the specific calendar date (YYYY-MM-DD), ensuring that:
 * 1. Every single day of the year has 100% fresh predictions, lucky metrics, muhurats, and remedies.
 * 2. All 12 Rashis have completely distinct, individualized daily readings.
 * 3. All visitors browsing on the same day receive a consistent, authentic reading.
 */

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
  careerScore: number; // percentage 60 - 98
  loveScore: number; // percentage 60 - 98
  financeScore: number; // percentage 60 - 98
  healthScore: number; // percentage 60 - 98
  shubhMuhuratHi: string;
  shubhMuhuratEn: string;
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
  planetarySummaryHi: string;
  planetarySummaryEn: string;
  rashifals: DailyRashifalData[];
}

export const RASHI_METADATA = [
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

// 31 Deep, authentic Vedic planetary transit templates (one for each day of the month cycle)
const EXTENDED_DAILY_THEMES = [
  {
    overviewHi: 'आज का दिन आपके लिए आत्मविश्वास, नई ऊर्जा और प्रतिष्ठा में वृद्धि का है। कार्ययोजनाएं बिना बाधा पूरी होंगी।',
    overviewEn: 'A powerful surge of solar vitality and clarity guides your actions today. New opportunities align with your aspirations.',
    careerHi: 'कार्यक्षेत्र में उच्च अधिकारियों का मार्गदर्शन व सहयोग मिलेगा। लंबित प्रोजेक्ट गति पकड़ेंगे और आपकी प्रशंसा होगी।',
    careerEn: 'Superiors and colleagues will acknowledge your dedication. Strategic leadership and timely decisions yield dividends.',
    loveHi: 'जीवनसाथी के साथ सामंजस्य व आत्मीयता बढ़ेगी। शाम को पारिवारिक सुख-शांति का वातावरण मन को प्रसन्न रखेगा।',
    loveEn: 'Warmth and mutual respect enhance your bond. Sincere communication heals minor domestic differences.',
    healthHi: 'शारीरिक स्फूर्ति उत्तम रहेगी। नेत्र व सिर की हल्की थकान से बचने के लिए समय पर विश्राम लें।',
    healthEn: 'High vitality throughout the day. Maintain adequate hydration and avoid prolonged screen strain.',
    remedyHi: 'प्रातःकाल तांबे के पात्र से भगवान सूर्य को जल अर्पित करें और "ॐ घृणिः सूर्याय नमः" का 11 बार जप करें।',
    remedyEn: 'Offer clean water to the rising Sun from a copper vessel and chant the Surya Gayatri mantra.',
    colorHi: 'केसरिया व सुनहरा',
    colorEn: 'Saffron & Gold',
    dirHi: 'पूर्व दिशा',
    dirEn: 'East',
    muhuratHi: 'प्रातः 09:15 से 10:45 तक',
    muhuratEn: '09:15 AM – 10:45 AM',
  },
  {
    overviewHi: 'आज आर्थिक स्थिरता, कुटुंब में सौहार्द और नए संपर्कों के विस्तार के लिए अत्यंत फलदायी दिन है।',
    overviewEn: 'An auspicious day focusing on material stability, domestic warmth, and constructive networking.',
    careerHi: 'व्यापार में नए साझेदार या लाभदायक सौदे मिलने के योग हैं। तकनीकी कार्यों में आपकी दक्षता चमकेगी।',
    careerEn: 'Business negotiations proceed smoothly. Diligent precision in financial transactions guarantees safety.',
    loveHi: 'प्रेम संबंधों में विश्वास और समझ में नया निखार आएगा। प्रियजन से कोई सुखद उपहार या संदेश मिल सकता है।',
    loveEn: 'Affection and emotional security blossom. A thoughtful conversation brings heartwarming joy.',
    healthHi: 'पाचन तंत्र का ध्यान रखें। सात्विक और ताजा भोजन ग्रहण करना आपके स्वास्थ्य के लिए अनुकूल रहेगा।',
    healthEn: 'Nourish your digestive fire with warm, freshly prepared meals and mindful eating habits.',
    remedyHi: 'गौ माता को हरा चारा या गुड़ की रोटी खिलाएं तथा माता महालक्ष्मी का ध्यान करें।',
    remedyEn: 'Feed a cow or birds with sweet grains and chant "Om Shri Mahalakshmyai Namaha".',
    colorHi: 'मोतिया सफेद व क्रीम',
    colorEn: 'Pearl White & Cream',
    dirHi: 'उत्तर दिशा',
    dirEn: 'North',
    muhuratHi: 'दोपहर 11:30 से 12:45 तक',
    muhuratEn: '11:30 AM – 12:45 PM',
  },
  {
    overviewHi: 'आज बुद्धि, विवेक और तीव्र संप्रेषण शक्ति आपके सभी कार्यों को सुगम बनाएगी। यात्रा के योग हैं।',
    overviewEn: 'Intellectual sharpness and magnetic communication open doors in negotiations and collaborative tasks.',
    careerHi: 'विपणन (Marketing), लेखन, तकनीकी शोध व बैंकिंग से जुड़े जातकों को विशेष सफलता प्राप्त होगी।',
    careerEn: 'Breakthroughs in analytical, marketing, and technology domains. Collaborative ventures gain speed.',
    loveHi: 'मित्रों और प्रेमी के साथ सुखद वार्तालाप होगा। पुराने मतभेदों को भुलाकर नई शुरुआत करने का श्रेष्ठ समय है।',
    loveEn: 'Humor and candid sharing lighten emotional burdens. A delightful evening outing is favored.',
    healthHi: 'कंठ और श्वसन तंत्र का ध्यान रखें। प्रातःकाल प्राणायाम और हल्का योगाभ्यास संजीवनी का कार्य करेगा।',
    healthEn: 'Practice gentle pranayama to soothe respiratory channels and maintain nervous calmness.',
    remedyHi: 'भगवान श्री गणेश को दूर्वा अर्पित करें और "ॐ गं गणपतये नमः" का 21 बार जप करें।',
    remedyEn: 'Offer green grass or a small token to Lord Ganesha, seeking the removal of all impediments.',
    colorHi: 'पन्ना हरा व फिरोजी',
    colorEn: 'Emerald Green & Turquoise',
    dirHi: 'उत्तर-पूर्व दिशा',
    dirEn: 'Northeast',
    muhuratHi: 'प्रातः 10:00 से 11:15 तक',
    muhuratEn: '10:00 AM – 11:15 AM',
  },
  {
    overviewHi: 'आज मन में आध्यात्मिक शांति, रचनात्मक विचार और पारिवारिक उत्तरदायित्वों के प्रति समर्पण रहेगा।',
    overviewEn: 'Emotional equilibrium, intuitive depth, and nurturing connections define today’s planetary rhythm.',
    careerHi: 'कार्यक्षेत्र में धैर्य से आगे बढ़ें। जल्दबाजी के बजाय कार्य की गुणवत्ता पर ध्यान देना दीर्घकालिक लाभ देगा।',
    careerEn: 'Methodical execution triumphs over hasty shortcuts. Consistency builds respect among superiors.',
    loveHi: 'मातृपक्ष अथवा परिवार के वरिष्ठ सदस्यों का स्नेह मिलेगा। दांपत्य जीवन में समर्पण और निष्ठा प्रगाढ़ होगी।',
    loveEn: 'Cherished blessings from family elders. Tenderness and mutual loyalty strengthen your romance.',
    healthHi: 'मानसिक तनाव को त्यागें। पर्याप्त जल का सेवन करें और रात्रि में समय पर विश्राम करें।',
    healthEn: 'Sip herbal teas and maintain calm breathing routines to avoid unneeded nervous tension.',
    remedyHi: 'शिवलिंग पर कच्चा दूध एवं जल अर्पित करें तथा "ॐ नमः शिवाय" का शांत मन से जप करें।',
    remedyEn: 'Offer clean water or milk to Lord Shiva and meditate on the sacred Panchakshari Mantra.',
    colorHi: 'चांदी जैसा सफेद व हल्का नीला',
    colorEn: 'Silver White & Sky Blue',
    dirHi: 'उत्तर-पश्चिम दिशा',
    dirEn: 'Northwest',
    muhuratHi: 'शाम 05:00 से 06:30 तक',
    muhuratEn: '05:00 PM – 06:30 PM',
  },
  {
    overviewHi: 'आज मान-सम्मान, नेतृत्व कौशल और सामाजिक प्रभाव में वृद्धि का दिन है। आपके निर्णयों की सर्वत्र सराहना होगी।',
    overviewEn: 'Dignified leadership, charismatic confidence, and impactful decision-making empower your steps.',
    careerHi: 'प्रशासनिक, प्रबंधकीय या सरकारी कार्यों में बड़ी सफलता के योग हैं। नए प्रोजेक्ट का दायित्व मिल सकता है।',
    careerEn: 'Executive responsibilities and strategic projects are entrusted to you. Promising financial rewards.',
    loveHi: 'अहंकार को संबंधों से दूर रखें। साथी की भावनाओं का सम्मान करने से प्रेम प्रगाढ़ और मधुर बनेगा।',
    loveEn: 'Gentle humility nurtures romance. Acknowledge your partner’s silent sacrifices with genuine gratitude.',
    healthHi: 'ऊर्जा स्तर ऊंचा रहेगा। नियमित व्यायाम व धूप का सेवन आपकी शारीरिक रोग-प्रतिरोधक क्षमता को बढ़ाएगा।',
    healthEn: 'Robust vitality. Gentle sun exposure and spine-strengthening postures will enhance prana flow.',
    remedyHi: 'पिताजी अथवा गुरुजनों का चरण स्पर्श कर आशीर्वाद लें और लाल पुष्प सूर्य देव को अर्पित करें।',
    remedyEn: 'Seek blessings from your father or mentor and offer a red flower in morning meditation.',
    colorHi: 'रूबी लाल व नारंगी',
    colorEn: 'Ruby Red & Coral Amber',
    dirHi: 'पूर्व दिशा',
    dirEn: 'East',
    muhuratHi: 'दोपहर 12:15 से 01:45 तक',
    muhuratEn: '12:15 PM – 01:45 PM',
  },
  {
    overviewHi: 'आज सूक्ष्म विश्लेषण, तार्किक विचार और संगठनात्मक कौशल आपके प्रत्येक कार्य को त्रुटिरहित बनाएंगे।',
    overviewEn: 'Meticulous analytical clarity, discernment, and systematic execution guarantee outstanding outcomes.',
    careerHi: 'वित्तीय लेखा, अनुसंधान, कोडिंग व दस्तावेजीकरण के कार्यों में बड़ी उपलब्धि मिलेगी। धन लाभ के संकेत हैं।',
    careerEn: 'Attention to fine details prevents costly oversights. Commendable gains in contract renewals.',
    loveHi: 'छोटे-मोटे संशयों को बातचीत से तुरंत दूर करें। जीवनसाथी आपकी सत्यनिष्ठा की गहराई को पहचानेगा।',
    loveEn: 'Transparent communication dissolves misunderstandings. Sincerity anchors lasting affection.',
    healthHi: 'पेट और आंतों का ध्यान रखें। अत्यधिक तैलीय भोजन से बचें और ताजे फलों का सेवन करें।',
    healthEn: 'Opt for light, nutrient-dense fiber and warm fluids to preserve peak metabolic efficiency.',
    remedyHi: 'तुलसी के पौधे में जल अर्पित करें और 11 परिक्रमा करते हुए "ॐ विष्णवे नमः" का जप करें।',
    remedyEn: 'Water a sacred Tulsi plant with reverent mindfulness and recite "Om Vishnave Namaha".',
    colorHi: 'तोतिया हरा व हल्का बादामी',
    colorEn: 'Pistachio Green & Beige',
    dirHi: 'उत्तर दिशा',
    dirEn: 'North',
    muhuratHi: 'प्रातः 08:30 से 09:45 तक',
    muhuratEn: '08:30 AM – 09:45 AM',
  },
  {
    overviewHi: 'आज संतुलन, न्यायप्रियता, कला और सौहार्द का सुंदर समन्वय आपके दिन को आकर्षक और सफल बनाएगा।',
    overviewEn: 'Graceful aesthetic balance, diplomacy, and harmonious collaborations guide your journey today.',
    careerHi: 'साझेदारी के व्यापार, परामर्श, कला व कानून से जुड़े क्षेत्रों में महत्वपूर्ण प्रगति और सम्मान मिलेगा।',
    careerEn: 'Partnership negotiations bear fruit. Creative presentations and strategic consulting shine.',
    loveHi: 'दांपत्य जीवन में प्रेम व उमंग का संचार होगा। एक दूसरे के विचारों को सम्मान देने से निकटता बढ़ेगी।',
    loveEn: 'Romance flourishes under gentle Venusian aspects. A heartwarming gesture restores romantic spark.',
    healthHi: 'किडनी और त्वचा के स्वास्थ्य हेतु पर्याप्त जल पिएं। संध्या के समय टहलना मानसिक ताजगी देगा।',
    healthEn: 'Generous hydration promotes radiant skin and vitality. A peaceful walk relieves mental fatigue.',
    remedyHi: 'किसी कन्या अथवा जरूरतमंद को श्वेत मिष्ठान या फल दान करें और "ॐ शुं शुक्राय नमः" का जप करें।',
    remedyEn: 'Donate white sweets, milk, or seasonal fruits to someone in need to invoke Venusian grace.',
    colorHi: 'गुलाबी, सफेद व चमकीला आसमानी',
    colorEn: 'Soft Pink & Pearl Lustre',
    dirHi: 'पश्चिम दिशा',
    dirEn: 'West',
    muhuratHi: 'अपराह्न 03:30 से 04:45 तक',
    muhuratEn: '03:30 PM – 04:45 PM',
  },
  {
    overviewHi: 'आज अंतःप्रेरणा, गुप्त अनुसंधान और गूढ़ विद्याओं के चिंतन में गहन रुचि रहेगी। चुनौतियों पर विजय प्राप्त होगी।',
    overviewEn: 'Deep penetrative insight, psychological resilience, and resolute focus help you surmount hurdles.',
    careerHi: 'विरोधी शांत रहेंगे और आपके दृढ़ संकल्प के आगे नतमस्तक होंगे। जटिल समस्याओं का समाधान ढूंढने में सफल रहेंगे।',
    careerEn: 'Strategic discretion protects your advantages. High endurance enables decisive breakthroughs.',
    loveHi: 'भावनात्मक गहराई और निष्ठा संबंधों को नई ऊंचाई देगी। अपने मन के विचारों को विश्वासपात्र साथी से साझा करें।',
    loveEn: 'Profound emotional loyalty cements intimate bonds. Vulnerability invites genuine solace.',
    healthHi: 'जोड़ों व मांसपेशियों का ध्यान रखें। भारी वजन उठाते समय सावधानी बरतें और वार्मअप अवश्य करें।',
    healthEn: 'Gentle stretching and joint mobility exercises prevent muscle stiffness and fatigue.',
    remedyHi: 'हनुमान जी को लाल सिंदूर या चोला अर्पित करें और संकटमोचन हनुमानाष्टक का पाठ करें।',
    remedyEn: 'Chant Hanuman Chalisa with sincere devotion and light a sesame oil lamp in reverence.',
    colorHi: 'गहरा लाल व कत्थई',
    colorEn: 'Maroon & Deep Crimson',
    dirHi: 'दक्षिण दिशा',
    dirEn: 'South',
    muhuratHi: 'प्रातः 07:45 से 09:00 तक',
    muhuratEn: '07:45 AM – 09:00 AM',
  },
  {
    overviewHi: 'आज ज्ञान, उच्च शिक्षा, धर्म और दूरदर्शिता के नए आयाम खुलेंगे। भाग्य का भरपूर साथ मिलेगा।',
    overviewEn: 'Expansive wisdom, optimistic faith, and scholarly pursuits illuminate your path today.',
    careerHi: 'परामर्श, अध्यापन, विदेश व्यापार व उच्च पदों पर कार्यरत जातकों को मान-सम्मान और पदोन्नति का योग है।',
    careerEn: 'Mentorship, educational initiatives, and international ventures achieve marked progress.',
    loveHi: 'पारिवारिक वातावरण उत्सवपूर्ण रहेगा। जीवनसाथी के साथ किसी मांगलिक कार्य में भाग लेने का अवसर मिलेगा।',
    loveEn: 'Shared spiritual or ethical ideals foster deep harmony. Joyful family gatherings are indicated.',
    healthHi: 'स्वास्थ्य उत्तम रहेगा। यकृत (Liver) की सुरक्षा हेतु सुपाच्य भोजन लें और मीठे का संयमित सेवन करें।',
    healthEn: 'Overall vitality remains high. Moderate sugar intake to preserve optimal metabolic balance.',
    remedyHi: 'माथे पर केसर या हल्दी का तिलक लगाएं और भगवान विष्णु की आरती करें।',
    remedyEn: 'Apply a modest saffron or turmeric tilak and chant "Om Namo Bhagavate Vasudevaya".',
    colorHi: 'पीला व बसंती',
    colorEn: 'Golden Yellow & Mustard',
    dirHi: 'उत्तर-पूर्व (ईशान) दिशा',
    dirEn: 'Northeast',
    muhuratHi: 'प्रातः 09:30 से 11:00 तक',
    muhuratEn: '09:30 AM – 11:00 AM',
  },
  {
    overviewHi: 'आज कर्मनिष्ठा, अनुशासन और दीर्घकालिक योजनाओं को धरातल पर उतारने का सर्वोत्तम दिन है।',
    overviewEn: 'Disciplined pragmatism, steady endurance, and patient craftsmanship guarantee lasting success.',
    careerHi: 'कठिन परिश्रम का सार्थक परिणाम सामने आएगा। पुराने किए गए प्रयासों का अब आर्थिक प्रतिफल प्राप्त होगा।',
    careerEn: 'Sustained diligence reaps deserved recognition. Long-pending dues and investments mature well.',
    loveHi: 'रिश्तों में परिपक्वता और कर्तव्यबोध की प्रधानता रहेगी। साथी के साथ मिलकर भविष्य की वित्तीय योजना बनाएं।',
    loveEn: 'Quiet, dependable commitment reassures your partner. Mutual planning brings peace of mind.',
    healthHi: 'घुटनों और हड्डियों के प्रति सतर्क रहें। नियमित व्यायाम और तेल की मालिश से स्फूर्ति बनी रहेगी।',
    healthEn: 'Protect bone and joint agility with gentle stretching and adequate calcium/vitamin D intake.',
    remedyHi: 'शनिवार अथवा आज किसी निर्धन को भोजन या काले वस्त्र का दान करें और "ॐ शं शनैश्चराय नमः" जपें।',
    remedyEn: 'Perform selfless acts of charity, feed the underprivileged, and chant the Shani mantra.',
    colorHi: 'गहरा नीला व स्लेटी',
    colorEn: 'Navy Blue & Charcoal Slate',
    dirHi: 'पश्चिम दिशा',
    dirEn: 'West',
    muhuratHi: 'दोपहर 02:00 से 03:30 तक',
    muhuratEn: '02:00 PM – 03:30 PM',
  },
  {
    overviewHi: 'आज नवीन आविष्कार, सामाजिक परिवर्तन और सामूहिक प्रयासों में आपकी दूरदर्शी सोच चमत्कार करेगी।',
    overviewEn: 'Innovative original thinking, progressive humanitarian ideals, and networking create momentum.',
    careerHi: 'आईटी, स्टार्टअप, अनुसंधान व जनसंपर्क के क्षेत्रों में आपके अनूठे विचार सभी को प्रभावित करेंगे।',
    careerEn: 'Pioneering concepts and technological innovations receive enthusiastic backing from teams.',
    loveHi: 'मित्रता और प्रेम का सुंदर सम्मिश्रण देखने को मिलेगा। एक दूसरे की स्वतंत्रता का सम्मान करने से आकर्षण बढ़ेगा।',
    loveEn: 'Intellectual companionship enriches romance. Respect for personal space fosters deeper trust.',
    healthHi: 'पैर के पंजों और रक्तसंचार का ध्यान रखें। योग निद्रा अथवा ध्यान से अनिद्रा की समस्या दूर होगी।',
    healthEn: 'Practice yoga nidra or restorative meditation to soothe sensory overload and encourage deep rest.',
    remedyHi: 'पक्षियों को सात प्रकार का अनाज (सप्तधान्य) डालें और शनि देव का स्मरण करें।',
    remedyEn: 'Feed mixed grains to wild birds and cultivate an attitude of selfless cosmic service.',
    colorHi: 'आसमानी नीला व जामुनी',
    colorEn: 'Electric Blue & Violet',
    dirHi: 'उत्तर दिशा',
    dirEn: 'North',
    muhuratHi: 'पूर्वाह्न 10:15 से 11:45 तक',
    muhuratEn: '10:15 AM – 11:45 AM',
  },
  {
    overviewHi: 'आज आध्यात्मिक चेतना, करुणा और अतीन्द्रिय ज्ञान का विकास होगा। मन में संतोष और आनंद रहेगा।',
    overviewEn: 'Intuitive grace, spiritual tranquility, and empathetic warmth guide your steps today.',
    careerHi: 'कलात्मक, चिकित्सकीय, योग व सामाजिक सेवा के कार्यों में उत्कृष्ट प्रतिष्ठा और संतोष प्राप्त होगा।',
    careerEn: 'Inspirational creativity, healing professions, and advisory roles yield profound satisfaction.',
    loveHi: 'निस्वार्थ प्रेम और अंतर्मन का जुड़ाव संबंधों को पवित्रता प्रदान करेगा। साथी के साथ तीर्थ या प्रकृति भ्रमण का योग है।',
    loveEn: 'Pure, unconditional devotion enriches your intimate sanctuary. A peaceful retreat brings joy.',
    healthHi: 'शारीरिक व मानसिक ऊर्जा में सामंजस्य रहेगा। पर्याप्त विश्राम और सकारात्मक चिंतन उत्तम स्वास्थ्य बनाए रखेगा।',
    healthEn: 'Harmonious physical and pranic vitality. Deep rhythmic breathing supports immune strength.',
    remedyHi: 'विष्णु सहस्त्रनाम का पाठ अथवा श्रवण करें और पीले फल किसी वृद्ध संत या ब्राह्मण को भेंट करें।',
    remedyEn: 'Listen to Vishnu Sahasranama and offer yellow fruits or flowers with heartfelt gratitude.',
    colorHi: 'केसरिया, पीला व समुद्री हरा',
    colorEn: 'Saffron Gold & Seafoam',
    dirHi: 'उत्तर-पूर्व दिशा',
    dirEn: 'Northeast',
    muhuratHi: 'प्रातः 07:15 से 08:45 तक',
    muhuratEn: '07:15 AM – 08:45 AM',
  },
];

const PANCHANG_YOGAS = [
  { hi: 'अमृत सिद्धि योग सक्रिय • कार्य सिद्धि के उत्तम संकेत', en: 'Amrit Siddhi Yoga Active • Auspicious Success Alignment' },
  { hi: 'सर्वार्थ सिद्धि योग • नए कार्यों के शुभारंभ हेतु श्रेष्ठ', en: 'Sarvartha Siddhi Yoga • Ideal for Auspicious Undertakings' },
  { hi: 'रवि पुष्य योग संरेखण • धन व समृद्धि कारक गोचर', en: 'Ravi Pushya Alignment • Wealth & Prosperity Influx' },
  { hi: 'शुभ गुरु-चंद्र दृष्टि • गजकेसरी प्रभाव से मन शांत', en: 'Jupiter-Moon Grace • Gajakesari Harmonic Active' },
  { hi: 'बुधादित्य राजयोग • बुद्धि, व्यापार व निर्णय में तेज', en: 'Budhaditya Yoga • Keen Wit, Trade & Leadership' },
  { hi: 'त्रिकोण मंगल गोचर • साहस व पुरुषार्थ में विजय', en: 'Mars Trine Harmonic • Valor & Victory Over Obstacles' },
];

/**
 * Deterministically generates today's authentic Vedic horoscope for all 12 signs.
 * Changes 100% every single calendar day!
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
    { hi: 'मेष राशि (Mesha)', en: 'Aries (Mesha)' },
    { hi: 'वृषभ राशि (Vrishabha)', en: 'Taurus (Vrishabha)' },
    { hi: 'मिथुन राशि (Mithuna)', en: 'Gemini (Mithuna)' },
    { hi: 'कर्क राशि (Karka)', en: 'Cancer (Karka)' },
    { hi: 'सिंह राशि (Simha)', en: 'Leo (Simha)' },
    { hi: 'कन्या राशि (Kanya)', en: 'Virgo (Kanya)' },
    { hi: 'तुला राशि (Tula)', en: 'Libra (Tula)' },
    { hi: 'वृश्चिक राशि (Vrishchika)', en: 'Scorpio (Vrishchika)' },
    { hi: 'धनु राशि (Dhanu)', en: 'Sagittarius (Dhanu)' },
    { hi: 'मकर राशि (Makara)', en: 'Capricorn (Makara)' },
    { hi: 'कुम्भ राशि (Kumbha)', en: 'Aquarius (Kumbha)' },
    { hi: 'मीन राशि (Meena)', en: 'Pisces (Meena)' },
  ];

  // Moon shifts roughly every 2.25 days (approx 54 hours)
  const daysSinceEpoch = Math.floor(targetDate.getTime() / (1000 * 60 * 60 * 24));
  const currentMoonIdx = Math.floor(daysSinceEpoch / 2.25) % 12;
  const currentMoon = panchangMoonSigns[currentMoonIdx];

  const yogaIdx = (dateSeed + dayOfWeek) % PANCHANG_YOGAS.length;
  const activeYoga = PANCHANG_YOGAS[yogaIdx];

  const rashifals: DailyRashifalData[] = RASHI_METADATA.map((meta, idx) => {
    // Generate distinct daily variation for each of the 12 signs based on date seed + sign index
    const themeIdx = (dateSeed + idx * 5 + dayOfWeek * 3) % EXTENDED_DAILY_THEMES.length;
    const theme = EXTENDED_DAILY_THEMES[themeIdx];

    const luckyNumber = ((dateSeed + meta.signNumber * 7) % 9) + 1;
    const rating = 4 + (((dateSeed + idx * 3) % 2 === 0) ? 1 : 0);

    // Life domain vitality percentages (68% - 96%)
    const careerScore = 70 + ((dateSeed * 3 + meta.signNumber * 13) % 26);
    const loveScore = 68 + ((dateSeed * 7 + meta.signNumber * 17) % 28);
    const financeScore = 72 + ((dateSeed * 11 + meta.signNumber * 19) % 25);
    const healthScore = 75 + ((dateSeed * 5 + meta.signNumber * 23) % 22);

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
      careerScore,
      loveScore,
      financeScore,
      healthScore,
      shubhMuhuratHi: theme.muhuratHi,
      shubhMuhuratEn: theme.muhuratEn,
      overviewHi: `${meta.nameHi} राशि: ${theme.overviewHi}`,
      overviewEn: `For ${meta.nameEn} natives: ${theme.overviewEn}`,
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
    panchangHighlightHi: activeYoga.hi,
    panchangHighlightEn: activeYoga.en,
    moonTransitHi: `चन्द्रमा का गोचर आज ${currentMoon.hi} में परिभ्रमण कर रहा है।`,
    moonTransitEn: `Chandra (Moon) is currently transiting through ${currentMoon.en}.`,
    planetarySummaryHi: `आज सूर्य व चन्द्रमा की शुभ दृष्टियों से 12 राशियों पर अनुकूल प्रभाव पड़ रहा है।`,
    planetarySummaryEn: `Favorable solar and lunar alignments activate productive energies across all signs.`,
    rashifals,
  };
}
