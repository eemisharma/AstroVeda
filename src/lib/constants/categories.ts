export interface ProblemCategory {
  id: string;
  slug: string;
  nameHi: string;
  nameEn: string;
  subtitleHi: string;
  subtitleEn: string;
  iconName: string;
  color: string;
  suggestedReportSlug: string;
  suggestedProducts: {
    nameHi: string;
    nameEn: string;
    descriptionHi: string;
    descriptionEn: string;
    badgeHi: string;
    badgeEn: string;
    price: number;
    benefitsHi: string[];
    benefitsEn: string[];
  }[];
}

export const CONSULTATION_CATEGORIES: ProblemCategory[] = [
  {
    id: 'love-relationship',
    slug: 'love-relationship',
    nameHi: 'प्रेम एवं विवाह समस्या',
    nameEn: 'Love & Relationship Problems',
    subtitleHi: 'विवाह में देरी, मनचाहा जीवनसाथी, प्रेम संबंधों में अनबन व तलाक योग',
    subtitleEn: 'Delayed marriage, partner compatibility, relationship turbulence & marital bliss',
    iconName: 'Heart',
    color: 'from-pink-500/20 to-rose-600/20 border-pink-500/30 text-pink-400',
    suggestedReportSlug: 'vedic-kundli-whatsapp',
    suggestedProducts: [
      {
        nameHi: 'प्राकृतिक रोज क्वार्ट्ज ब्रेसलेट',
        nameEn: 'Natural Rose Quartz Harmony Bracelet',
        descriptionHi: 'प्रेम, आकर्षण और पारस्परिक सौहार्द बढ़ाने वाला प्राकृतिक क्रिस्टल।',
        descriptionEn: 'Promotes unconditional love, emotional healing, and relationship warmth.',
        badgeHi: 'सर्वाधिक लोकप्रिय',
        badgeEn: 'Bestseller',
        price: 499,
        benefitsHi: ['हृदय चक्र को संतुलित करता है', 'प्रेम संबंधों में विश्वास और मधुरता लाता है'],
        benefitsEn: ['Balances Heart Chakra', 'Restores relationship trust and harmony'],
      },
      {
        nameHi: 'सिद्ध दो मुखी रुद्राक्ष',
        nameEn: 'Energized 2-Mukhi Rudraksha',
        descriptionHi: 'शिव-पार्वती का स्वरूप, दांपत्य जीवन के क्लेश समाप्त करने हेतु सिद्ध।',
        descriptionEn: 'Ardhanarishvara blessing for marital peace, mutual understanding, and unity.',
        badgeHi: 'वैदिक सिद्ध',
        badgeEn: 'Vedic Consecrated',
        price: 899,
        benefitsHi: ['दांपत्य कलह और गलतफहमियां दूर करता है', 'शीघ्र विवाह के योग प्रशस्त करता है'],
        benefitsEn: ['Alleviates marital discord', 'Fosters early marriage opportunities'],
      },
      {
        nameHi: 'सिद्ध शुक्र यंत्र (ताम्र पत्र)',
        nameEn: 'Siddha Shukra Yantra (Copper Plate)',
        descriptionHi: 'शुक्र ग्रह के दुर्बल प्रभावों को शांत कर आकर्षण और वैवाहिक सुख प्रदाता।',
        descriptionEn: 'Strengthens Venus energies for romance, beauty, and emotional satisfaction.',
        badgeHi: 'ग्रह शांति',
        badgeEn: 'Planetary Remedy',
        price: 649,
        benefitsHi: ['विवाह बाधा दूर करता है', 'संबंधों में स्थायी आकर्षण और स्नेह बढ़ाता है'],
        benefitsEn: ['Removes marriage hurdles', 'Enhances enduring mutual affection'],
      },
    ],
  },
  {
    id: 'job-money-business',
    slug: 'job-money-business',
    nameHi: 'नौकरी, धन एवं व्यापार समस्या',
    nameEn: 'Job, Money & Business Problems',
    subtitleHi: 'नौकरी में रुकावट, व्यापार में घाटा, अटका हुआ धन, कर्ज मुक्ति व पदोन्नति',
    subtitleEn: 'Career stagnation, financial instability, blocked wealth & business growth',
    iconName: 'Briefcase',
    color: 'from-amber-500/20 to-yellow-600/20 border-amber-500/30 text-amber-400',
    suggestedReportSlug: 'comprehensive-destiny',
    suggestedProducts: [
      {
        nameHi: 'प्राकृतिक पाइराइट (धन आकर्षण क्लस्टर)',
        nameEn: 'Natural Golden Pyrite Wealth Magnet',
        descriptionHi: 'व्यापार स्थल और कार्यक्षेत्र में धन वृद्धि और नए अवसरों के द्वार खोलने वाला।',
        descriptionEn: 'Known as Fools Gold, powerful stone for attracting cashflow and abundance.',
        badgeHi: 'धन योग',
        badgeEn: 'Wealth Booster',
        price: 699,
        benefitsHi: ['व्यापार में नए ग्राहकों का आगमन बढ़ाता है', 'आर्थिक रुकावटों को समाप्त करता है'],
        benefitsEn: ['Attracts new clients & income streams', 'Removes financial stagnancy'],
      },
      {
        nameHi: 'सिद्ध सात मुखी महालक्ष्मी रुद्राक्ष',
        nameEn: 'Energized 7-Mukhi Mahalakshmi Rudraksha',
        descriptionHi: 'माँ लक्ष्मी का साक्षात स्वरूप, दरिद्रता नाश और स्थिर धन प्राप्ति हेतु सिद्ध।',
        descriptionEn: 'Governed by Goddess Mahalakshmi; blesses with wealth, stability, and luck.',
        badgeHi: 'महालक्ष्मी कृपा',
        badgeEn: 'Prosperity Shield',
        price: 999,
        benefitsHi: ['अटके हुए धन की वापसी के रास्ते खोलता है', 'नौकरी में पदोन्नति व व्यापार में वृद्धि'],
        benefitsEn: ['Assists in recovering stalled payments', 'Aids job promotions & venture growth'],
      },
      {
        nameHi: 'अष्टधातु सिद्ध श्री यंत्र',
        nameEn: 'Ashtadhatu Energized Shree Yantra',
        descriptionHi: 'समस्त आर्थिक मनोकामनाओं की पूर्ति और घर-दुकान में स्थायी समृद्धि हेतु।',
        descriptionEn: 'The supreme sacred geometry for perpetual wealth, success, and prosperity.',
        badgeHi: 'सर्व सिद्ध',
        badgeEn: 'Supreme Sacred',
        price: 849,
        benefitsHi: ['व्यापारिक घाटे को मुनाफे में बदलता है', 'वास्तु एवं आर्थिक दोषों का शमन'],
        benefitsEn: ['Transforms losses into profitability', 'Dispels financial Vastu flaws'],
      },
    ],
  },
  {
    id: 'health-disease',
    slug: 'health-disease',
    nameHi: 'स्वास्थ्य, रोग एवं शारीरिक कष्ट',
    nameEn: 'Disease & Health Problems',
    subtitleHi: 'दीर्घकालिक बीमारियां, मानसिक तनाव, अज्ञात रोग, ऊर्जा ह्रास व आरोग्य संकट',
    subtitleEn: 'Chronic ailments, anxiety, low vitality, recurring health issues & mental stress',
    iconName: 'Activity',
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
    suggestedReportSlug: 'life-direction-transit',
    suggestedProducts: [
      {
        nameHi: 'सिद्ध महामृत्युंजय रक्षा कवच',
        nameEn: 'Siddha Mahamrityunjaya Healing Kavach',
        descriptionHi: 'भगवान शिव का परम रक्षा कवच, अकाल संकट और गंभीर रोगों से मुक्ति हेतु सिद्ध।',
        descriptionEn: 'Lord Shiva’s ultimate protective shield for vitality, immunity, and longevity.',
        badgeHi: 'आरोग्य वरदान',
        badgeEn: 'Health Armor',
        price: 899,
        benefitsHi: ['शारीरिक दुर्बलता और अज्ञात रोगों से सुरक्षा', 'मानसिक भय व नकारात्मकता का नाश'],
        benefitsEn: ['Protects from chronic debility & fear', 'Revitalizes biological cellular energy'],
      },
      {
        nameHi: 'प्राकृतिक पंचमुखी रुद्राक्ष माला (१०८ मनके)',
        nameEn: 'Pure 5-Mukhi Rudraksha Japa Mala (108 Beads)',
        descriptionHi: 'दैनिक जप और धारण से रक्तचाप, मानसिक तनाव और अनिद्रा में चमत्कारी शांति।',
        descriptionEn: 'Classic 108-bead mala for meditation, soothing nervous anxiety and hypertension.',
        badgeHi: 'मानसिक शांति',
        badgeEn: 'Mind Tranquility',
        price: 549,
        benefitsHi: ['उच्च व निम्न रक्तचाप को संतुलित करता है', 'एकाग्रता और गहरी निद्रा में सहायक'],
        benefitsEn: ['Aids in calming heart & nervous system', 'Improves deep restorative sleep'],
      },
      {
        nameHi: 'सिद्ध सूर्य यंत्र (आरोग्य एवं जीवनी शक्ति)',
        nameEn: 'Energized Surya Yantra for Vitality',
        descriptionHi: 'समस्त आरोग्य और जीवन ऊर्जा के कारक सूर्य देव की कृपा प्राप्ति हेतु।',
        descriptionEn: 'Infuses vital prana, strengthening immunity and ocular/cardiac health.',
        badgeHi: 'प्राण ऊर्जा',
        badgeEn: 'Solar Prana',
        price: 649,
        benefitsHi: ['प्रतिरक्षा तंत्र (Immunity) को सबल बनाता है', 'आलस्य और ऊर्जा की कमी दूर करता है'],
        benefitsEn: ['Bolsters natural bodily immunity', 'Alleviates chronic lethargy & weakness'],
      },
    ],
  },
  {
    id: 'planetary-tantrik-remedies',
    slug: 'planetary-tantrik-remedies',
    nameHi: 'दोष निवारण, तांत्रिक कष्ट एवं नवग्रह शांति',
    nameEn: 'Tantrik, Dosha Shanti & Planetary Solutions',
    subtitleHi: 'कालसर्प दोष, मांगलिक दोष, राहु-केतु पीड़ा, नजर दोष, ऊपरी बाधा व शनि साढ़े साती',
    subtitleEn: 'Kaal Sarp, Manglik dosha, Rahu-Ketu afflictions, evil eye & Saturn Sade Sati',
    iconName: 'Shield',
    color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30 text-purple-400',
    suggestedReportSlug: 'vedic-kundli-whatsapp',
    suggestedProducts: [
      {
        nameHi: 'सिद्ध नवग्रह शांति महायंत्र',
        nameEn: 'Siddha Navgrah Shanti Maha Yantra',
        descriptionHi: 'नौ के नौ ग्रहों के अशुभ प्रभावों, नीच दृष्टि और मारक दशाओं को शांत करने वाला।',
        descriptionEn: 'Harmonizes all 9 planetary forces, alleviating malefic transits and dasha stress.',
        badgeHi: 'सर्वग्रह शांति',
        badgeEn: '9 Planets Shanti',
        price: 949,
        benefitsHi: ['शनि, राहु और केतु की पीड़ा शांत करता है', 'घर में सकारात्मक ऊर्जा का संचार करता है'],
        benefitsEn: ['Pacifies Saturn, Rahu & Ketu harshness', 'Radiates protective aura across living space'],
      },
      {
        nameHi: 'नजर दोष एवं तांत्रिक बाधा निवारक कवच',
        nameEn: 'Evil Eye & Negative Energy Protection Kavach',
        descriptionHi: 'ईर्ष्या, नजर दोष और अवांछित नकारात्मक ऊर्जाओं को तुरंत परास्त करने वाला कवच।',
        descriptionEn: 'Consecrated amulet that dispels psychic negativity, jealousy, and evil eye.',
        badgeHi: 'पूर्ण सुरक्षा',
        badgeEn: 'Total Protection',
        price: 599,
        benefitsHi: ['अकारण काम रुकने की समस्या से मुक्ति', 'परिवार व व्यापार पर बुरी नजर का प्रभाव रोकता है'],
        benefitsEn: ['Breaks unexplained repetitive roadblocks', 'Shields family & shop from hostile eyes'],
      },
      {
        nameHi: 'सिद्ध अष्टमुखी व दशमुखी रुद्राक्ष युग्म',
        nameEn: 'Energized 8 & 10 Mukhi Rudraksha Pair',
        descriptionHi: 'भगवान गणेश व भगवान विष्णु का संयुक्त आशीर्वाद, सभी प्रकार के तंत्र-मंत्र व भय नाशक।',
        descriptionEn: 'Ganesha & Vishnu synergy; annihilates planetary curses and invisible fears.',
        badgeHi: 'महा संकट नाशक',
        badgeEn: 'Curse Annihilator',
        price: 1499,
        benefitsHi: ['राहु-केतु और कालसर्प दोष को शांत करता है', 'अकाल मृत्यु और कोर्ट-कचहरी संकट से रक्षा'],
        benefitsEn: ['Mitigates severe Kaal Sarp afflictions', 'Shields against legal entanglements & fears'],
      },
    ],
  },
];
