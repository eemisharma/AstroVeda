import type { ChartData } from '../astrology/types';

export interface ReportSectionContent {
  summary: string;
  personality: string;
  career: string;
  finance: string;
  relationships: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  important_periods: string[];
  disclaimer: string;
}

const HINDI_SIGNS: Record<string, string> = {
  Aries: 'मेष (Aries)',
  Taurus: 'वृषभ (Taurus)',
  Gemini: 'मिथुन (Gemini)',
  Cancer: 'कर्क (Cancer)',
  Leo: 'सिंह (Leo)',
  Virgo: 'कन्या (Virgo)',
  Libra: 'तुला (Libra)',
  Scorpio: 'वृश्चिक (Scorpio)',
  Sagittarius: 'धनु (Sagittarius)',
  Capricorn: 'मकर (Capricorn)',
  Aquarius: 'कुंभ (Aquarius)',
  Pisces: 'मीन (Pisces)',
};

const HINDI_PLANETS: Record<string, string> = {
  Sun: 'सूर्य (Surya)',
  Moon: 'चंद्र (Chandra)',
  Mars: 'मंगल (Mangal)',
  Mercury: 'बुध (Budha)',
  Jupiter: 'गुरु (Guru / Brihaspati)',
  Venus: 'शुक्र (Shukra)',
  Saturn: 'शनि (Shani)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)',
};

export function getHindiSign(signStr: string): string {
  if (!signStr) return '';
  const firstWord = signStr.split(' ')[0].replace(/[^a-zA-Z]/g, '');
  return HINDI_SIGNS[firstWord] || signStr;
}

export function getHindiPlanet(planetName: string): string {
  return HINDI_PLANETS[planetName] || planetName;
}

export function generateHindiReportContent(params: {
  customerName: string;
  serviceName: string;
  chartData: ChartData;
}): ReportSectionContent {
  const { customerName, chartData } = params;

  const ascSignHindi = getHindiSign(chartData.ascendant.sign);
  const moonSignHindi = getHindiSign(chartData.moonSign);
  const sunSignHindi = getHindiSign(chartData.sunSign);
  const nakshatra = chartData.nakshatra || 'रोहिणी';
  const dasha = chartData.dasha?.currentMahadasha ? getHindiPlanet(chartData.dasha.currentMahadasha) : 'गुरु (बृहस्पति)';
  const currentYear = new Date().getFullYear();

  const summary = `नमस्ते ${customerName} जी। आपकी वैदिक जन्म कुंडली का सूक्ष्म विश्लेषण यह स्पष्ट दर्शाता है कि आपका व्यक्तित्व गहन बौद्धिक संतुलन, विवेकपूर्ण दूरदर्शिता और आंतरिक आत्मबल का अनुपम संगम है। आपका लग्न ${ascSignHindi} और चंद्र राशि ${moonSignHindi} होने के कारण आप जीवन के प्रत्येक महत्वपूर्ण निर्णय को अत्यंत सोच-समझकर और दृढ़ता से लेते हैं। जन्म नक्षत्र ${nakshatra} का शुभ प्रभाव आपको अप्रत्याशित चुनौतियों में भी शांत, संयमित और गरिमामयी बनाए रखने की स्वाभाविक क्षमता प्रदान करता है। वर्तमान में आप ${dasha} महादशा के प्रभाव में हैं, जो आपके जीवन में आत्म-अधिकार की स्थापना, प्राथमिकताओं का सुदृढ़ीकरण और दीर्घकालिक उपलब्धियों का स्वर्णिम कालखंड प्रदर्शित करता है।`;

  const personality = `आपका लग्न ${ascSignHindi} आपके बाह्य आचरण, मुखमंडल और सामाजिक आभा का निर्धारण करता है—यह आपको एक प्रभावशाली, गंभीर और स्वाभाविक नेतृत्वकर्ता के रूप में स्थापित करता है। बाह्य स्वरूप के भीतर, आपका मन, विचार और संवेदनशीलता ${moonSignHindi} चंद्र राशि से संचालित होती है। आप सतही सामाजिक दिखावे की तुलना में वास्तविक आत्मीयता और बौद्धिक गहराई को प्राथमिकता देते हैं। ${sunSignHindi} में स्थित सूर्य आपकी आंतरिक जीवन-ऊर्जा का पोषण करता है, जिससे आप कठिन परिश्रम, ईमानदारी और अपनी योग्यता के बल पर समाज में मान-सम्मान अर्जित करते हैं। अत्यधिक मानसिक दबाव के समय आप भावनाओं को भीतर ही दबा लेते हैं; दैनिक ध्यान और प्राणायाम आपके मानसिक संतुलन को अखंडित रखने में अत्यंत फलदायी रहेगा।`;

  const career = `आपकी कुंडली में कर्म भाव (दशम भाव) और ग्रह स्थितियां यह इंगित करती हैं कि आप रणनीतिक योजना, प्रबंधन, विश्लेषणात्मक चिंतन और स्वतंत्र कार्यशैली में असाधारण सफलता प्राप्त करने में सक्षम हैं। आप उन कार्यक्षेत्रों में सर्वाधिक फलते-फूलते हैं जहां आपकी विशेषज्ञता और स्वतंत्र निर्णय क्षमता का सम्मान किया जाता है। परामर्श (Advisory), सूचना प्रौद्योगिकी, वित्तीय प्रबंधन, अनुसंधान, शिक्षा या स्वतंत्र उद्यम आपके लिए विशेष रूप से अनुकूल हैं। वर्तमान ${dasha} के प्रभावकाल में किसी भी प्रकार के सट्टे या जल्दबाजी वाले जोखिम से बचें और दीर्घकालिक संस्थागत मूल्य के निर्माण पर ध्यान केंद्रित करें। वरिष्ठ और अनुभवी मार्गदर्शकों के साथ संबंध भविष्य में बड़े लाभ प्रदान करेंगे।`;

  const finance = `आपकी कुंडली के द्वितीय (धन) एवं एकादश (लाभ) भाव के ग्रह योग अनुशासित उपार्जन और समय के साथ निरंतर संपत्ति वृद्धि का संकेत देते हैं। आपके भीतर धन संचय और संसाधनों के विवेकपूर्ण उपयोग की स्वाभाविक क्षमता है। आपकी आर्थिक स्थिति अचानक मिलने वाले लाभ की अपेक्षा निरंतर बचत, सुरक्षित परिसंपत्ति निर्माण और कौशल संवर्धन के माध्यम से सुदृढ़ होती है। अत्यधिक खर्चीले ग्रह गोचर के समय भावनात्मक और आवेगी व्यय से बचें; एक व्यवस्थित मासिक बचत योजना आपके भविष्य को आर्थिक रूप से सुरक्षित और निश्चिंत रखेगी।`;

  const relationships = `पारस्परिक और दांपत्य संबंधों में आपकी कुंडली भावनात्मक निष्ठा, बौद्धिक सम्मान और व्यक्तिगत सीमाओं की सुरक्षा पर बल देती है। आप एक ऐसे जीवनसाथी को प्राथमिकता देते हैं जो आपकी कार्यनिष्ठा को समझे और बाहरी सामाजिक व्यस्तताओं के उपरांत एक शांत व सामंजस्यपूर्ण आश्रय प्रदान करे। सप्तम भाव और शुक्र ग्रह के प्रभाव यह सुझाव देते हैं कि मन की बातों और अपेक्षाओं को समय रहते स्पष्ट और कोमल शब्दों में व्यक्त करने से किसी भी प्रकार की गलतफहमी नहीं पनपती। स्वयं को बहुत अधिक आत्मनिर्भर दिखाने के स्थान पर जब आप आत्मीयता से अपनी भावनाएं साझा करते हैं, तो दांपत्य जीवन अत्यंत मधुर और प्रगाढ़ बन जाता है।`;

  const strengths = [
    `रणनीतिक विवेकशीलता: जटिल और चुनौतीपूर्ण परिस्थितियों का निष्पक्ष विश्लेषण करने तथा सही दिशा चुनने की स्वाभाविक क्षमता (${ascSignHindi} लग्न प्रभाव)।`,
    `आंतरिक धैर्य एवं स्थिरता: बाहरी उथल-पुथल या संकट के समय भी मानसिक संतुलन और संकल्पशक्ति बनाए रखना (${moonSignHindi} चंद्र प्रभाव)।`,
    `सूक्ष्म अंतर्दृष्टि: ${nakshatra} नक्षत्र के प्रभाव से भावी संभावनाओं और लोगों के वास्तविक इरादों को पूर्व में ही भांप लेने की अद्भुत क्षमता।`,
    `सत्यनिष्ठा एवं कर्तव्यपरायणता: अपने कर्म और वचनों के प्रति उच्च ईमानदारी तथा सतही समझौतों से पूर्ण परहेज़।`,
    `मार्गदर्शन एवं नेतृत्व क्षमता: दूसरों को सही दिशा दिखाने, व्यवस्थित योजना बनाने और सामूहिक लक्ष्य प्राप्ति का नेतृत्व करने का गुण।`,
  ];

  const challenges = [
    `अति-परिपूर्णता (Perfectionism) का दबाव: स्वयं से और सहयोगियों से अत्यधिक उच्च मानकों की अपेक्षा रखना, जिससे कभी-कभी अवांछित मानसिक थकान हो सकती है।`,
    `भावनाओं को दबाने की प्रवृत्ति: किसी बात से आहत होने पर तुरंत संवाद करने के स्थान पर मौन रहकर अकेले ही सोचने की आदत।`,
    `अत्यधिक सोच-विचार (Overthinking): जीवन के बड़े और गैर-रैखिक मोड़ों पर अत्यधिक विश्लेषण के कारण निर्णय लेने में देरी करना।`,
    `विश्राम और कार्य में असंतुलन: काम में पूरी तरह लीन रहने के दौरान अपने शारीरिक स्वास्थ्य, पोषण और आराम की अनदेखी करना।`,
  ];

  const recommendations = [
    `दैनिक प्रातःकालीन ध्यान व प्राणायाम: प्रतिदिन प्रातः 10-15 मिनट शांत बैठकर 'ॐ' ध्वनि का उच्चारण या प्राणायाम करें, जिससे मानसिक एकाग्रता और ऊर्जा में वृद्धि होगी।`,
    `पारदर्शी एवं स्पष्ट संवाद: परिवार और जीवनसाथी के साथ अपने मन की बात को समय पर साझा करें, जिससे पारिवारिक सामंजस्य सदा बना रहे।`,
    `नियमित दान एवं सेवा: अपनी सामर्थ्य अनुसार माह में एक बार जरूरतमंदों को अन्न, वस्त्र या शिक्षा सामग्री का दान करें, जिससे ग्रह दोषों का शमन होता है।`,
    `दीर्घकालिक आर्थिक समीक्षा: हर तीन माह में अपने आय-व्यय और निवेश की समीक्षा करें और अनावश्यक खर्चों पर नियंत्रण रखें।`,
    `अनुकूल वैदिक मंत्र जप: अपने इष्ट देव का ध्यान करते हुए दैनिक गायत्री मंत्र या महामृत्युंजय मंत्र की एक माला का जाप आत्मिक सुरक्षा प्रदान करता है।`,
  ];

  const important_periods = [
    `${currentYear} का मध्य भाग – स्थिरता एवं ध्यान: करियर में नए कौशल सीखने, ज्ञान संवर्धन और दीर्घकालिक योजनाओं को सुव्यवस्थित करने के लिए उत्तम समय।`,
    `${currentYear} का उत्तरार्ध – साझेदारी एवं विस्तार: अनुकूल ग्रह गोचर के प्रभाव से नए व्यावसायिक संबंध, पारिवारिक मांगलिक कार्य और नए अवसर प्राप्त होंगे।`,
    `${currentYear + 1} – भौतिक एवं आर्थिक उपलब्धि: ${dasha} महादशा के शुभ प्रभाव से स्थायी संपत्ति, वाहन या महत्वपूर्ण वित्तीय लक्ष्य की प्राप्ति का योग।`,
    `${currentYear + 2} – आत्मिक शांति एवं रचनात्मक नवजीवन: आंतरिक संतुष्टि, तीर्थाटन या आध्यात्मिक साधना के माध्यम से जीवन में नवीन ऊर्जा का संचार।`,
  ];

  const disclaimer =
    'यह ज्योतिषीय विश्लेषण विशुद्ध रूप से आपके द्वारा प्रदान किए गए जन्म विवरण एवं पारंपरिक वैदिक गणितीय सिद्धांतों पर आधारित है। ज्योतिष जीवन की प्रवृत्तियों, ऊर्जाओं और संभावित अवसरों का मार्गदर्शन करता है; आपके सचेत कर्म, संकल्प और सकारात्मक निर्णय ही आपके भविष्य का वास्तविक निर्माण करते हैं।';

  return {
    summary,
    personality,
    career,
    finance,
    relationships,
    strengths,
    challenges,
    recommendations,
    important_periods,
    disclaimer,
  };
}

export function generateEnglishReportContent(params: {
  customerName: string;
  serviceName: string;
  chartData: ChartData;
}): ReportSectionContent {
  const { customerName, chartData } = params;
  const asc = chartData.ascendant.sign;
  const moon = chartData.moonSign;
  const sun = chartData.sunSign;
  const nak = chartData.nakshatra || 'Rohini';
  const dasha = chartData.dasha?.currentMahadasha || 'Jupiter';
  const currentYear = new Date().getFullYear();

  const summary = `Welcome ${customerName}. Your astrological blueprint reveals a distinctive balance of intentional intellect and deep emotional perception. With your Ascendant in ${asc} and your Moon residing in ${moon}, you naturally approach life with discerning vision and a high standard of personal authenticity. Your birth under the ${nak} Nakshatra confers an instinctive capacity to navigate complexities with poise and resilience. You are currently navigating the ${dasha} Mahadasha cycle, a period characterized by consolidation of personal authority, refined priorities, and sustained long-term accomplishments.`;

  const personality = `Your Ascendant in ${asc} shapes the way you engage with your environment—projecting natural leadership, deliberate judgment, and steady poise. Beneath this external persona, your Moon in ${moon} governs your inner emotional processing. You possess a reflective, perceptive nature and prioritize genuine depth over superficial social interactions. Sun in ${sun} supplies your internal vitality, prompting you to seek recognition through authentic competence and unwavering integrity. When facing intense stress, you tend to process grievances inwardly; establishing regular mindfulness and pranayama routines will help sustain your inner harmony.`;

  const career = `Astrological indicators for your professional sphere highlight strong aptitude for strategic planning, systems thinking, and autonomous execution. Your 10th house dynamics suggest that you thrive best in environments where your domain expertise is trusted without micromanagement. Roles involving advisory capacities, analytical problem-solving, innovative technology, or sustainable commerce are exceptionally well-aligned. During this ${dasha} period, focus on building long-term institutional value rather than chasing speculative short-term pivots. Networking with established mentors will yield valuable collaborative dividends.`;

  const finance = `Your 2nd and 11th house signatures indicate disciplined earning potential with progressive accumulation over time. You possess an instinct for prudent resource allocation and are generally risk-conscious. Wealth creation is favored through diversified, asset-backed instruments and continuous investment in your professional skills. Be mindful of sudden emotional expenditures during intense transit periods; creating an automated monthly allocation strategy guarantees stability and peace of mind.`;

  const relationships = `In relational dynamics, your chart emphasizes emotional loyalty, mutual intellectual respect, and healthy boundaries. You value a partner who understands your desire for purposeful endeavor while providing a peaceful sanctuary from public demands. Venusian and 7th house influences suggest that clear, candid verbal expression prevents minor misunderstandings from festering. When you allow yourself to be vulnerable rather than overly self-reliant, your partnerships deepen substantially.`;

  const strengths = [
    `Strategic Discernment: Natural ability to analyze complex situations objectively (${asc} Lagna influence).`,
    `Resilient Inner Focus: Emotional grounding and perseverance during periods of external turbulence (${moon} Moon placement).`,
    `Intuitive Foresight: Perceptive instincts and adaptability fostered by your ${nak} Nakshatra.`,
    `Commitment to Excellence: High integrity, diligent craftsmanship, and an aversion to superficial compromise.`,
    `Mentorship Potential: Innate ability to guide others and establish structured pathways to shared success.`,
  ];

  const challenges = [
    `Perfectionistic Pressure: Tendency to hold yourself and colleagues to excessively rigorous standards, leading to mental fatigue.`,
    `Reserved Communication: Inclination to process emotional grievances privately rather than communicating expectations early.`,
    `Overthinking Strategic Pivots: Analysis paralysis when facing ambiguous or non-linear life choices.`,
    `Work-Rest Disconnect: Neglecting restorative pauses and physical relaxation during demanding career cycles.`,
  ];

  const recommendations = [
    `Cultivate a Daily Grounding Practice: Dedicate 15 minutes each morning to uninterrupted meditation, journaling, or pranayama.`,
    `Practice Expressive Vulnerability: Share your thought process and emotions transparently with trusted loved ones before decisions finalize.`,
    `Establish Clear Digital Boundaries: Unplug from work communications after sunset to restore your mental vitality.`,
    `Periodic Financial Review: Review asset allocation quarterly with a trusted financial planner to capitalize on steady compounding.`,
    `Sacred Mantric Chanting: Regular recitation of the Gayatri Mantra or Mahamrityunjaya Mantra facing East confers spiritual protection and clarity.`,
  ];

  const important_periods = [
    `Mid ${currentYear} – Consolidation & Focus: Planetary transitions support deep professional upskilling and restructuring long-term commitments.`,
    `Late ${currentYear} / Early ${currentYear + 1} – Collaborative Expansion: Favorable planetary aspects unlock new relational and professional alliances.`,
    `${currentYear + 1} – Material & Intellectual Milestone: Harmonious alignment under ${dasha} Mahadasha for establishing long-term wealth assets.`,
    `${currentYear + 2} – Creative & Spiritual Renewal: A revitalizing cycle for personal creative expression, travel, and purposeful introspection.`,
  ];

  const disclaimer =
    'This consultation report is generated for personal guidance, self-reflection, and psychological awareness based on classical Vedic mathematical principles. Astrology provides insights into tendencies and archetypal patterns; your conscious choices, character, and actions shape your destiny.';

  return {
    summary,
    personality,
    career,
    finance,
    relationships,
    strengths,
    challenges,
    recommendations,
    important_periods,
    disclaimer,
  };
}

