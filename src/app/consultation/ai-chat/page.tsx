'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  User,
  ArrowLeft,
  Bot,
  RotateCcw,
  Copy,
  Check,
  Download,
  Info,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  HelpCircle,
  Lock,
  ShieldCheck,
  CreditCard,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface ProfileState {
  fullName: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  lagna: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  currentDasha: string;
  problemCategory: string;
  orderNumber?: string;
}

const DEFAULT_DEMO_PROFILE: ProfileState = {
  fullName: 'राहुल शर्मा',
  gender: 'Male',
  birthDate: '1995-08-15',
  birthTime: '10:30',
  birthCity: 'नई दिल्ली',
  lagna: 'मेष (Aries)',
  moonSign: 'वृश्चिक (Scorpio)',
  sunSign: 'सिंह (Leo)',
  nakshatra: 'अनुराधा (Anuradha)',
  currentDasha: 'राहु - बृहस्पति (Rahu - Jupiter)',
  problemCategory: 'करियर एवं संपूर्ण वैदिक समाधान',
};

function AIChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const orderId = searchParams.get('orderId');

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [profile, setProfile] = useState<ProfileState>(DEFAULT_DEMO_PROFILE);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [restoreOrderNumber, setRestoreOrderNumber] = useState('');
  const [restoreError, setRestoreError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isUnlocked) {
      scrollToBottom();
    }
  }, [messages, isTyping, isUnlocked]);

  // Check Payment & Access Status
  useEffect(() => {
    setIsCheckingAccess(true);

    // 1. If orderId is in query params, verify payment from database
    if (orderId) {
      fetch(`/api/customer/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order && (data.order.paymentStatus === 'SUCCESS' || data.order.status === 'PAID')) {
            const ord = data.order;
            const bp = ord.birthProfile;
            const astro = ord.analysis?.astrologyData || {};

            const loadedProfile: ProfileState = {
              fullName: ord.user?.name || bp?.fullName || DEFAULT_DEMO_PROFILE.fullName,
              gender: bp?.gender || 'Not specified',
              birthDate: bp?.dateOfBirth || (bp?.birthDate ? new Date(bp.birthDate).toISOString().split('T')[0] : '1995-08-15'),
              birthTime: bp?.timeOfBirth || bp?.birthTime || '12:00',
              birthCity: bp?.birthCity || 'India',
              lagna: astro.ascendant?.sign || 'मेष (Aries)',
              moonSign: astro.moonSign || 'वृश्चिक (Scorpio)',
              sunSign: astro.sunSign || 'सिंह (Leo)',
              nakshatra: astro.nakshatra || 'रोहिणी (Rohini)',
              currentDasha: astro.dasha?.currentMahadasha
                ? `${astro.dasha.currentMahadasha} - ${astro.dasha.currentAntardasha || ''}`
                : 'बृहस्पति - शनि (Jupiter - Saturn)',
              problemCategory: ord.service?.name || 'वैदिक परामर्श',
              orderNumber: ord.orderNumber,
            };

            setProfile(loadedProfile);
            setIsUnlocked(true);
            try {
              localStorage.setItem('astroveda_chat_unlocked', 'true');
            } catch {}
            initializeWelcomeMessage(loadedProfile);
          } else {
            setIsUnlocked(false);
          }
        })
        .catch(() => {
          setIsUnlocked(false);
        })
        .finally(() => setIsCheckingAccess(false));
    } else {
      // 2. Check if previous unlock exists in local storage
      try {
        const storedUnlock = localStorage.getItem('astroveda_chat_unlocked');
        if (storedUnlock === 'true') {
          setIsUnlocked(true);
          initializeWelcomeMessage(DEFAULT_DEMO_PROFILE);
        } else {
          setIsUnlocked(false);
        }
      } catch {
        setIsUnlocked(false);
      }
      setIsCheckingAccess(false);
    }
  }, [orderId, language]);

  const initializeWelcomeMessage = (prof: ProfileState) => {
    const isHi = language === 'hi';
    const welcomeText = isHi
      ? `सादर प्रणाम **${prof.fullName} जी**! 🙏

मैं **आचार्य AstroVeda** हूँ। **Chat Live (लाइव चैट)** परामर्श में आपका स्वागत है। आपकी जन्म कुंडली का ढाँचा मेरे समक्ष उपस्थित है:
* **लग्न:** ${prof.lagna}
* **चन्द्र राशि:** ${prof.moonSign}
* **जन्म नक्षत्र:** ${prof.nakshatra}
* **वर्तमान महादशा:** ${prof.currentDasha}

आप अपने करियर, नौकरी, विवाह, प्रेम संबंध, आर्थिक स्थिति, स्वास्थ्य अथवा ग्रह शांति के संबंध में कोई भी प्रश्न निःसंकोच पूछ सकते हैं। आप नीचे दिए गए त्वरित प्रश्नों पर भी क्लिक कर सकते हैं:`
      : `Warm blessings and Namaste **${prof.fullName}**! 🙏

I am **Acharya AstroVeda**. Welcome to **Chat Live** consultation. Your personal Vedic astrological chart is active in our session:
* **Ascendant (Lagna):** ${prof.lagna}
* **Moon Sign (Rashi):** ${prof.moonSign}
* **Birth Nakshatra:** ${prof.nakshatra}
* **Current Mahadasha:** ${prof.currentDasha}

Feel free to ask any question regarding your career, promotions, relationships, marriage prospects, finances, or Vedic remedies. You can also select any of the suggested questions below:`;

    setMessages([
      {
        id: 'welcome-msg',
        role: 'model',
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          message: text,
          language,
          chatHistory,
          customBirthDetails: profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get astrological response');
      }

      const botMsg: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessageItem = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content:
          language === 'hi'
            ? 'संजोगवश संपर्क में क्षणिक बाधा आई। कृपया अपना प्रश्न पुनः पूछें या कुछ क्षण बाद प्रयास करें।'
            : 'A brief connection issue occurred. Please ask your question again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTranscript = () => {
    const header = `=========================================\nASTROVEDA - CHAT LIVE VEDIC CONSULTATION\nClient: ${profile.fullName}\nLagna: ${profile.lagna} | Rashi: ${profile.moonSign}\nDasha: ${profile.currentDasha}\nDate: ${new Date().toLocaleDateString()}\n=========================================\n\n`;
    const body = messages
      .map((m) => `[${m.timestamp}] ${m.role === 'user' ? profile.fullName : 'आचार्य AstroVeda'}:\n${m.content}\n\n`)
      .join('---\n\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AstroVeda_ChatLive_${profile.fullName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Instant Demo Unlock for testing
  const handleInstantDemoUnlock = () => {
    try {
      localStorage.setItem('astroveda_chat_unlocked', 'true');
    } catch {}
    setIsUnlocked(true);
    initializeWelcomeMessage(profile);
  };

  // Restore access via Order Number
  const handleRestoreOrder = () => {
    if (!restoreOrderNumber.trim()) {
      setRestoreError(language === 'hi' ? 'कृपया सही ऑर्डर संख्या दर्ज करें' : 'Please enter a valid order number');
      return;
    }
    // Verify order
    fetch(`/api/customer/orders/${restoreOrderNumber.trim()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order && (data.order.paymentStatus === 'SUCCESS' || data.order.status === 'PAID')) {
          router.push(`/consultation/ai-chat?orderId=${data.order.id}`);
        } else {
          setRestoreError(
            language === 'hi'
              ? 'ऑर्डर संख्या नहीं मिली या भुगतान लंबित है।'
              : 'Order not found or payment pending.'
          );
        }
      })
      .catch(() => {
        setRestoreError(
          language === 'hi'
            ? 'ऑर्डर संख्या नहीं मिली। कृपया पुनः जांचें।'
            : 'Order could not be verified. Please check.'
        );
      });
  };

  const quickQuestionsHi = [
    '💼 क्या इस वर्ष नौकरी में पदोन्नति या स्थानांतरण का योग है?',
    '💍 विवाह और जीवनसाथी के आगमन का शुभ समय कब है?',
    '💰 आर्थिक समृद्धि और धन लाभ के लिए कौन से उपाय करें?',
    '🪐 मेरी वर्तमान महादशा और शनि की साढ़े साती का क्या प्रभाव है?',
    '📿 ग्रह शांति के लिए कौन सा वैदिक मंत्र अथवा रत्न शुभ रहेगा?',
  ];

  const quickQuestionsEn = [
    '💼 Are there favorable planetary indications for job promotion this year?',
    '💍 When is an auspicious time for marriage and relationship harmony?',
    '💰 What Vedic remedies support financial stability and abundance?',
    '🪐 How is my current Mahadasha cycle and Saturn transit affecting me?',
    '📿 Which sacred mantra or gemstone is most suitable for my Lagna?',
  ];

  const quickQuestions = language === 'hi' ? quickQuestionsHi : quickQuestionsEn;

  // -------------------------------------------------------------
  // 1. LOADING SCREEN
  // -------------------------------------------------------------
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-navy-950 shadow-gold-glow animate-pulse mb-4">
          <Bot className="w-7 h-7" />
        </div>
        <p className="text-sm font-semibold text-gold-300">
          {language === 'hi' ? 'Chat Live सत्यापन हो रहा है...' : 'Verifying Chat Live Access...'}
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. PAYWALL / PAYMENT REQUIRED SCREEN (₹99)
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient Cosmic Orbs */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-xl bg-navy-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-gold-glow-lg text-center relative z-10 animate-page-enter">
          {/* Lock & Astrologer Avatar */}
          <div className="relative w-20 h-20 mx-auto mb-2">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400 via-amber-500 to-gold-600 flex items-center justify-center text-navy-950 shadow-gold-glow">
              <Bot className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-navy-950 border-2 border-gold-400 flex items-center justify-center text-gold-400 shadow-sm">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'hi' ? 'सशुल्क सेवा • Chat Live' : 'Premium Service • Chat Live'}</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-2 font-heading">
              {language === 'hi' ? 'आचार्य जी से Chat Live परामर्श' : 'Chat Live with Acharya AstroVeda'}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
              {language === 'hi'
                ? 'अपनी जन्म कुंडली के आधार पर करियर, विवाह, प्रेम, धन व ग्रह शांति के सभी सवालों के तुरंत सटीक वैदिक समाधान पाएं।'
                : 'Get immediate, personalized Vedic astrological answers based on your actual birth chart, Lagna, and active Mahadasha.'}
            </p>
          </div>

          {/* Pricing Highlight (₹99) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-amber-500/20 to-gold-500/15 border border-gold-400/60 flex items-center justify-between text-left shadow-gold-glow">
            <div>
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                {language === 'hi' ? '1-on-1 लाइव परामर्श' : '1-on-1 Live Consultation'}
              </span>
              <strong className="text-white font-heading text-sm sm:text-base">
                {language === 'hi' ? 'असीमित प्रश्न • तुरंत समाधान' : 'Unlimited Questions • Instant Answers'}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 line-through mr-1.5">₹299</span>
              <span className="text-2xl sm:text-3xl font-black text-gold-400 font-mono">₹99</span>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left text-xs text-gray-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-navy-950/60 border border-navy-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'hi' ? 'व्यक्तिगत कुंडली का लाइव अध्ययन' : 'Live Natal Chart Synthesis'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-navy-950/60 border border-navy-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'hi' ? 'करियर, विवाह व धन पर मार्गदर्शन' : 'Career, Marriage & Wealth Forecast'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-navy-950/60 border border-navy-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'hi' ? 'वैदिक उपाय, रत्न व मंत्र सुझाव' : 'Remedies, Mantras & Gemstones'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-navy-950/60 border border-navy-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'hi' ? 'चैट ट्रांसक्रिप्ट डाउनलोड सुविधा' : 'Full Chat Transcript Download'}</span>
            </div>
          </div>

          {/* Primary Action Button: Pay ₹99 */}
          <div className="space-y-3 pt-2">
            <Link
              href="/checkout/comprehensive-destiny"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-sm sm:text-base hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95 animate-luxury-glow"
            >
              <CreditCard className="w-5 h-5" />
              <span>
                {language === 'hi'
                  ? '₹99 का भुगतान करें और Chat Live शुरू करें'
                  : 'Pay ₹99 & Start Chat Live'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Test Mode / Instant Demo Unlock Button */}
            <button
              onClick={handleInstantDemoUnlock}
              className="w-full py-2.5 px-4 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-gold-500/30 text-gold-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>
                {language === 'hi'
                  ? '⚡ तुरंत टेस्ट अनलॉक (Demo / Simulator Access)'
                  : '⚡ Instant Demo Unlock (Simulator Access)'}
              </span>
            </button>
          </div>

          {/* Restore Previous Order */}
          <div className="pt-3 border-t border-navy-800 space-y-2">
            <p className="text-[11px] text-gray-400">
              {language === 'hi'
                ? 'क्या आप पहले से ₹99 का भुगतान कर चुके हैं?'
                : 'Already paid for your consultation?'}
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={restoreOrderNumber}
                onChange={(e) => {
                  setRestoreOrderNumber(e.target.value);
                  setRestoreError('');
                }}
                placeholder={language === 'hi' ? 'ऑर्डर ID दर्ज करें...' : 'Enter Order ID...'}
                className="flex-1 bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
              />
              <button
                onClick={handleRestoreOrder}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gold-400 font-bold text-xs border border-gold-500/30 transition-all active:scale-95 shrink-0"
              >
                {language === 'hi' ? 'सत्यापित करें' : 'Verify'}
              </button>
            </div>
            {restoreError && <p className="text-[11px] text-rose-400">{restoreError}</p>}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Return to Home'}</span>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. UNLOCKED CHAT LIVE INTERFACE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-between text-gray-100 relative">
      {/* Top Consultation Navigation Bar */}
      <div className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur-md border-b border-navy-700/80 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Back & Acharya Identity */}
          <div className="flex items-center gap-3">
            <Link
              href={orderId ? `/payment/success?orderId=${orderId}` : '/'}
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white transition-all active:scale-95"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 via-amber-500 to-gold-600 flex items-center justify-center text-navy-950 shadow-gold-glow">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-navy-900 rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-white font-heading tracking-wide">
                    {language === 'hi' ? 'आचार्य AstroVeda' : 'Acharya AstroVeda'}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                    Chat Live • ₹99
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {language === 'hi' ? 'लाइव चैट सक्रिय • कुंडली कनेक्टेड' : 'Chat Live Active • Kundali Connected'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="px-2.5 py-1.5 rounded-xl bg-navy-800 border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 text-xs font-bold transition-all active:scale-95"
              title="Toggle Language"
            >
              {language === 'hi' ? 'English' : 'हिन्दी'}
            </button>

            {/* Profile Drawer Toggle */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-gold-400 transition-all active:scale-95"
              title="Kundali Details"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Download Transcript */}
            <button
              onClick={handleDownloadTranscript}
              className="hidden sm:flex p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-gold-400 transition-all active:scale-95"
              title="Download Transcript"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Clear Chat */}
            <button
              onClick={() => initializeWelcomeMessage(profile)}
              className="p-2 rounded-xl bg-navy-800 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 transition-all active:scale-95"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Personalized Kundali Ribbon */}
        <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-gray-300 overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            <User className="w-3.5 h-3.5 text-gold-400" />
            <strong className="text-white font-medium">{profile.fullName}</strong>
            {profile.orderNumber && (
              <span className="text-[10px] text-gray-400 font-mono">#{profile.orderNumber}</span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-navy-800/80 px-2 py-0.5 rounded-md border border-navy-700">
              {language === 'hi' ? 'लग्न:' : 'Lagna:'} <strong className="text-gold-300">{profile.lagna}</strong>
            </span>
            <span className="bg-navy-800/80 px-2 py-0.5 rounded-md border border-navy-700">
              {language === 'hi' ? 'राशि:' : 'Rashi:'} <strong className="text-gold-300">{profile.moonSign}</strong>
            </span>
            <span className="bg-navy-800/80 px-2 py-0.5 rounded-md border border-navy-700 hidden sm:inline-block">
              {language === 'hi' ? 'दशा:' : 'Dasha:'} <strong className="text-gold-300">{profile.currentDasha}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-4 overflow-y-auto">
        {/* Verification / Order Badge if from checkout */}
        {orderId && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-page-enter">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'आपका ₹99 Chat Live परामर्श सत्यापित है। आचार्य जी आपकी कुंडली का अध्ययन करके उत्तर दे रहे हैं।'
                  : 'Your ₹99 Chat Live consultation is verified. Acharya is reviewing your full birth chart.'}
              </span>
            </div>
            <Link
              href={`/payment/success?orderId=${orderId}`}
              className="text-emerald-400 hover:underline shrink-0 font-bold"
            >
              {language === 'hi' ? 'ऑर्डर विवरण' : 'Order Details'}
            </Link>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 animate-page-enter ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-navy-950 font-bold text-xs shrink-0 mt-1 shadow-gold-glow">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 relative group transition-all ${
                  isModel
                    ? 'bg-navy-900 border border-gold-500/30 text-gray-200 shadow-gold-glow-sm'
                    : 'bg-gradient-to-r from-gold-500/20 to-amber-500/20 border border-gold-500/50 text-white rounded-tr-none'
                }`}
              >
                {/* Header for model msg */}
                {isModel && (
                  <div className="flex items-center justify-between text-xs text-gold-400 font-semibold mb-2 pb-1.5 border-b border-navy-800">
                    <span className="flex items-center gap-1.5 font-heading">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      {language === 'hi' ? 'आचार्य AstroVeda • Chat Live' : 'Acharya AstroVeda • Chat Live'}
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-gray-400 hover:text-gold-300 p-1 rounded-md transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {msg.content}
                </div>

                <div className="mt-2 text-[10px] text-gray-400 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-navy-900 border border-gold-500/30 rounded-2xl px-4 py-3 text-xs text-gold-300 flex items-center gap-2 shadow-gold-glow-sm">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce delay-150" />
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce delay-300" />
              <span className="ml-1">
                {language === 'hi'
                  ? 'आचार्य जी आपकी कुंडली और ग्रह गोचर का अध्ययन कर रहे हैं...'
                  : 'Acharya is synthesizing your planetary charts and transits...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions & Message Input Area */}
      <div className="sticky bottom-0 z-30 bg-navy-900/95 backdrop-blur-md border-t border-navy-700/80 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Quick Questions Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] uppercase font-bold text-gold-400 shrink-0 tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {language === 'hi' ? 'सुझाव:' : 'Prompts:'}
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="shrink-0 px-3 py-1 rounded-full bg-navy-800 hover:bg-gold-500/20 border border-gold-500/30 text-gray-300 hover:text-gold-200 text-xs transition-all active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'आचार्य जी से अपनी समस्या या कुंडली से जुड़ा प्रश्न पूछें...'
                    : 'Ask Acharya regarding career, love, finance, or remedies...'
                }
                className="w-full bg-navy-950 border border-gold-500/40 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all pr-10"
                disabled={isTyping}
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 sm:px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 text-navy-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? 'पूछें' : 'Send'}</span>
            </button>
          </form>

          {/* Disclaimer */}
          <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
            <Info className="w-3 h-3 text-gold-400 shrink-0" />
            <span>
              {language === 'hi'
                ? 'वैदिक परामर्श मार्गदर्शन एवं आत्म-जागरूकता हेतु है। आपके कर्म और विवेक आपके भाग्य के निर्माता हैं।'
                : 'Vedic astrology offers archetypal guidance. Your conscious choices, actions, and character shape your destiny.'}
            </span>
          </p>
        </div>
      </div>

      {/* Edit Kundali Details Modal / Drawer */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-gold-glow-lg animate-page-enter">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  {language === 'hi' ? 'कुंडली विवरण संशोधित करें' : 'Vedic Profile Details'}
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300">
              {language === 'hi'
                ? 'आचार्य जी इन्हीं विवरणों के आधार पर आपकी जन्म पत्रिका का विश्लेषण करेंगे।'
                : 'Acharya personalizes every response based on these astrological attributes.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">{language === 'hi' ? 'जातक का नाम' : 'Full Name'}</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{language === 'hi' ? 'जन्म स्थान / शहर' : 'Birth City'}</label>
                <input
                  type="text"
                  value={profile.birthCity}
                  onChange={(e) => setProfile({ ...profile, birthCity: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{language === 'hi' ? 'लग्न (Ascendant)' : 'Ascendant (Lagna)'}</label>
                <input
                  type="text"
                  value={profile.lagna}
                  onChange={(e) => setProfile({ ...profile, lagna: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{language === 'hi' ? 'चन्द्र राशि (Moon Sign)' : 'Moon Sign (Rashi)'}</label>
                <input
                  type="text"
                  value={profile.moonSign}
                  onChange={(e) => setProfile({ ...profile, moonSign: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{language === 'hi' ? 'जन्म नक्षत्र' : 'Nakshatra'}</label>
                <input
                  type="text"
                  value={profile.nakshatra}
                  onChange={(e) => setProfile({ ...profile, nakshatra: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{language === 'hi' ? 'वर्तमान महादशा' : 'Current Dasha'}</label>
                <input
                  type="text"
                  value={profile.currentDasha}
                  onChange={(e) => setProfile({ ...profile, currentDasha: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-navy-800">
              <button
                onClick={() => {
                  initializeWelcomeMessage(profile);
                  setShowProfileModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs hover:bg-gold-400 transition-all"
              >
                {language === 'hi' ? 'सहेजें एवं पुनः आरंभ करें' : 'Save & Refresh Consultation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-400 border-t-transparent" />
        </div>
      }
    >
      <AIChatContent />
    </Suspense>
  );
}
