'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import PaymentSimulatorModal from '@/components/checkout/PaymentSimulatorModal';
import { getStoredUtm } from '@/lib/marketing/utm';
import { useLanguage } from '@/lib/i18n/context';
import { HINDI_SERVICES } from '@/lib/i18n/translations';

const DEFAULT_SERVICES = [
  { id: '1', slug: 'quick-kundli-glance', name: 'Quick Kundli Glance & Planetary Insights', price: 49 },
  { id: '2', slug: 'life-direction-transit', name: 'Life Direction & Transit Guide', price: 89 },
  { id: '3', slug: 'comprehensive-destiny', name: 'Comprehensive Destiny & House Analysis', price: 99 },
  { id: '4', slug: 'vedic-kundli-whatsapp', name: 'Deep Vedic Kundli + Live WhatsApp Consultation', price: 149 },
  { id: '5', slug: 'premium-master-horoscope', name: 'AstroVeda Master Horoscope & Remedial Blueprint [Premium - Coming Soon]', price: 499 },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const serviceSlug = params.serviceSlug as string;

  const matchedFallback =
    DEFAULT_SERVICES.find((s) => s.slug === serviceSlug) || DEFAULT_SERVICES[2];

  const [service, setService] = useState<any>(matchedFallback);
  const [allServices, setAllServices] = useState<any[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Authentication State for Step 1
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    timeOfBirth: '',
    birthCity: '',
    birthCountry: 'India',
    gender: 'Male',
    currentCity: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Fetch all active services for ascending dropdown switcher
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setAllServices(data.services);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/services/${serviceSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Service not found');
        return res.json();
      })
      .then((data) => {
        if (data.service) {
          setService(data.service);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback for service:', serviceSlug, err);
        const fallback =
          DEFAULT_SERVICES.find((s) => s.slug === serviceSlug) || DEFAULT_SERVICES[2];
        setService(fallback);
      })
      .finally(() => setLoading(false));

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          setFormData((prev) => ({
            ...prev,
            name: prev.name || data.user.name || '',
            email: prev.email || data.user.email || '',
            phone: prev.phone || data.user.phone || '',
          }));
        }
      })
      .catch(() => {});
  }, [serviceSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  // Step 1: Sign Up Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = language === 'hi' ? 'वैध ईमेल पता आवश्यक है' : 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = language === 'hi' ? 'वैध 10-अंकीय व्हाट्सएप नंबर आवश्यक है' : 'Valid 10-digit WhatsApp number is required';
    if (!password || password.length < 6) errors.password = language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: password.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      setCurrentUser(data.user);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Step 1: Sign In Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const errors: Record<string, string> = {};
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = language === 'hi' ? 'वैध ईमेल पता आवश्यक है' : 'Valid email is required';
    if (!password) errors.password = language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें' : 'Please enter your password';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: password.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setCurrentUser(data.user);
      setFormData((prev) => ({
        ...prev,
        name: data.user.name || prev.name,
        email: data.user.email || prev.email,
        phone: data.user.phone || prev.phone,
      }));
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Step 2 -> Step 3
  const handleNextToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.dateOfBirth) errors.dateOfBirth = language === 'hi' ? 'जन्म तिथि आवश्यक है' : 'Date of birth is required';
    if (!formData.timeOfBirth) errors.timeOfBirth = language === 'hi' ? 'सटीक जन्म समय आवश्यक है' : 'Exact birth time is required';
    if (!formData.birthCity.trim()) errors.birthCity = language === 'hi' ? 'जन्म स्थान/शहर आवश्यक है' : 'Birth city is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = async () => {
    setIsSubmitting(true);
    setPaymentError('');

    try {
      const utm = getStoredUtm() || {};

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug,
          ...formData,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_content: utm.utm_content,
          fbclid: utm.fbclid,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to initialize order');
      }

      setPaymentOrder(orderData);

      let razorpayInstance = (window as any).Razorpay;
      if (!razorpayInstance && !orderData.isSimulated) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        razorpayInstance = (window as any).Razorpay;
      }

      if (orderData.isSimulated || !razorpayInstance) {
        setShowSimulator(true);
      } else {
        const options = {
          key: orderData.keyId,
          amount: Math.round(orderData.amount * 100),
          currency: orderData.currency,
          name: 'AstroVeda',
          description: orderData.serviceName,
          order_id: orderData.gatewayOrderId,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#e5b842',
          },
          handler: async function (response: any) {
            handleVerifyPayment({
              gatewayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new razorpayInstance(options);
        rzp.on('payment.failed', function (resp: any) {
          router.push(`/payment/failed?error=${encodeURIComponent(resp.error.description || 'Payment Failed')}`);
        });
        rzp.open();
      }
    } catch (err: any) {
      setPaymentError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleVerifyPayment = async (paymentData: {
    gatewayOrderId: string;
    paymentId: string;
    signature: string;
  }) => {
    try {
      const res = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paymentOrder.orderId,
          gatewayOrderId: paymentData.gatewayOrderId,
          paymentId: paymentData.paymentId,
          signature: paymentData.signature,
        }),
      });

      const verifyData = await res.json();
      if (!res.ok) {
        throw new Error(verifyData.error || 'Verification failed');
      }

      // Requirement 1: Save purchased order locally so it is permanently accessible in dashboard
      try {
        const existing = JSON.parse(localStorage.getItem('astroveda_customer_orders') || '[]');
        const newOrder = {
          id: paymentOrder.orderId,
          orderNumber: paymentOrder.orderNumber,
          status: 'ANALYSIS_READY',
          amount: activeService.price,
          createdAt: new Date().toISOString(),
          service: {
            id: activeService.id,
            name: activeService.name,
            slug: activeService.slug,
            price: activeService.price,
          },
          user: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
          },
          birthProfile: {
            fullName: formData.name.trim(),
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            birthCity: formData.birthCity,
            birthCountry: formData.birthCountry || 'India',
            gender: formData.gender,
            currentCity: formData.currentCity,
          },
        };
        localStorage.setItem(
          'astroveda_customer_orders',
          JSON.stringify([newOrder, ...existing.filter((o: any) => o.id !== paymentOrder.orderId)])
        );

        // Pre-initialize timer timestamp so it starts counting down smoothly without resets
        localStorage.setItem(`astroveda_timer_start_${paymentOrder.orderNumber}`, String(Date.now()));
        localStorage.setItem(`astroveda_timer_start_${paymentOrder.orderId}`, String(Date.now()));

        // Trigger immediate background sync to link order with logged in user account
        fetch('/api/customer/sync-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: [newOrder] }),
        }).catch(() => {});

        if (activeService.price >= 99 || ['chat-live', 'ai-chat', 'comprehensive-destiny', 'vedic-kundli-whatsapp'].includes(activeService.slug)) {
          const unlocked = JSON.parse(localStorage.getItem('astroveda_unlocked_chat_orders') || '[]');
          if (!unlocked.includes(paymentOrder.orderId)) {
            localStorage.setItem('astroveda_unlocked_chat_orders', JSON.stringify([...unlocked, paymentOrder.orderId]));
          }
        }
      } catch (storageErr) {
        console.warn('Local storage save skipped:', storageErr);
      }

      // Requirement 6: Automatically trigger WhatsApp when ₹149 service is selected
      const resolvedPrice = (service?.price ?? matchedFallback.price);
      if (resolvedPrice === 149 || serviceSlug === 'vedic-kundli-whatsapp') {
        const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';
        const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
          language === 'hi'
            ? `नमस्ते AstroVeda, मैंने ₹149 का वैदिक कुंडली + व्हाट्सएप परामर्श (ऑर्डर #${paymentOrder.orderNumber}) का भुगतान सफलतापूर्वक पूरा किया है। कृपया मेरी कुंडली का लाइव विश्लेषण आरंभ करें।`
            : `Hello AstroVeda, I have completed payment for my ₹149 Vedic Kundli + WhatsApp consultation (Order #${paymentOrder.orderNumber}). Please initiate my consultation.`
        )}`;
        try {
          window.open(waUrl, '_blank');
        } catch {}
      }

      router.push(`/payment/success?orderId=${paymentOrder.orderId}`);
    } catch (err: any) {
      setShowSimulator(false);
      router.push(`/payment/failed?error=${encodeURIComponent(err.message)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-400 border-t-transparent" />
      </div>
    );
  }

  const activeService =
    service ||
    DEFAULT_SERVICES.find((s) => s.slug === serviceSlug) ||
    DEFAULT_SERVICES[2];

  const localizedServiceName =
    language === 'hi' && HINDI_SERVICES[activeService.slug]
      ? HINDI_SERVICES[activeService.slug].name
      : activeService.name;

  const localizedDeliveryTime =
    language === 'hi' && HINDI_SERVICES[activeService.slug]
      ? HINDI_SERVICES[activeService.slug].deliveryTime
      : activeService.deliveryTime;

  // Coming Soon tier (₹499)
  if (activeService.price === 499 || serviceSlug === 'premium-master-horoscope') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-navy-900 border border-amber-500/40 rounded-3xl p-8 text-center shadow-gold-glow">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
            {language === 'hi' ? 'आगामी विशेष सेवा' : 'Coming Soon'}
          </span>
          <h1 className="text-2xl font-black text-white font-heading mb-2">
            {localizedServiceName} (₹499)
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
            {language === 'hi'
              ? 'यह हमारा सम्पूर्ण वैदिक मास्टर पैकेज है जिसमें सभी 10 सेवाएं, विस्तृत भविष्यफल एवं अभिमंत्रित उपाय उत्पाद सम्मिलित हैं। यह सेवा अतिशीघ्र लाइव हो रही है।'
              : 'Our master package including all 10 consultations, complete lifecycle forecasting, and consecrated remedial products is launching soon!'}
          </p>
          <div className="space-y-3">
            <div className="text-left bg-navy-950/80 border border-navy-800 rounded-2xl p-4 mb-4">
              <span className="text-[11px] font-bold text-gold-400 block mb-2">
                {language === 'hi' ? 'तत्काल उपलब्ध परामर्श (आरोही क्रम):' : 'Instantly Available Consultations (Ascending):'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/checkout/quick-kundli-glance"
                  className="p-2.5 rounded-xl bg-navy-900 border border-gold-500/30 hover:border-gold-500 text-left block transition-colors"
                >
                  <span className="text-xs font-bold text-gold-400 block font-mono">₹49</span>
                  <span className="text-[11px] text-gray-200 line-clamp-1">
                    {language === 'hi' ? 'त्वरित कुंडली दृष्टि' : 'Quick Glance'}
                  </span>
                </Link>
                <Link
                  href="/checkout/life-direction-transit"
                  className="p-2.5 rounded-xl bg-navy-900 border border-gold-500/30 hover:border-gold-500 text-left block transition-colors"
                >
                  <span className="text-xs font-bold text-gold-400 block font-mono">₹89</span>
                  <span className="text-[11px] text-gray-200 line-clamp-1">
                    {language === 'hi' ? 'गोचर व जीवन दिशा' : 'Transit Guide'}
                  </span>
                </Link>
                <Link
                  href="/checkout/comprehensive-destiny"
                  className="p-2.5 rounded-xl bg-navy-900 border border-gold-500/30 hover:border-gold-500 text-left block transition-colors"
                >
                  <span className="text-xs font-bold text-gold-400 block font-mono">₹99</span>
                  <span className="text-[11px] text-gray-200 line-clamp-1">
                    {language === 'hi' ? 'विस्तृत भाग्य + चैट लाइव' : 'Destiny + Chat Live'}
                  </span>
                </Link>
                <Link
                  href="/checkout/vedic-kundli-whatsapp"
                  className="p-2.5 rounded-xl bg-navy-900 border border-emerald-500/40 hover:border-emerald-500 text-left block transition-colors"
                >
                  <span className="text-xs font-bold text-emerald-400 block font-mono">₹149</span>
                  <span className="text-[11px] text-gray-200 line-clamp-1">
                    {language === 'hi' ? 'व्हाट्सएप परामर्श' : 'WhatsApp Chat'}
                  </span>
                </Link>
              </div>
            </div>

            <Link
              href="/services"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm block hover:brightness-110 transition-all"
            >
              {language === 'hi' ? 'समस्त 5 रिपोर्ट्स का विवरण देखें' : 'View All 5 Reports Catalog'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Requirement 3: Sequential 3-Step Checkout Flow */}
      <div className="flex items-center justify-between mb-8 px-2">
        {/* Step 1: Sign Up / Sign In */}
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-gold-500 text-navy-950 shadow-gold-glow' : 'bg-navy-800 text-gray-500'
          }`}>
            1
          </div>
          <span className={`text-xs font-semibold ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
            {language === 'hi' ? '1. साइन अप / लॉगिन' : '1. Sign Up / Sign In'}
          </span>
        </div>

        <div className={`flex-1 h-[2px] mx-3 ${step >= 2 ? 'bg-gold-500/80' : 'bg-navy-800'}`} />

        {/* Step 2: Birth Details */}
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-gold-500 text-navy-950 shadow-gold-glow' : 'bg-navy-800 text-gray-500'
          }`}>
            2
          </div>
          <span className={`text-xs font-semibold ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>
            {language === 'hi' ? '2. जन्म विवरण' : '2. Birth Details'}
          </span>
        </div>

        <div className={`flex-1 h-[2px] mx-3 ${step === 3 ? 'bg-gold-500/80' : 'bg-navy-800'}`} />

        {/* Step 3: Payment */}
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 3 ? 'bg-gold-500 text-navy-950 shadow-gold-glow' : 'bg-navy-800 text-gray-500'
          }`}>
            3
          </div>
          <span className={`text-xs font-semibold ${step === 3 ? 'text-white' : 'text-gray-500'}`}>
            {language === 'hi' ? '3. भुगतान' : '3. Payment'}
          </span>
        </div>
      </div>

      {/* Selected Service Header Banner with Ascending Service Switcher */}
      <div className="bg-navy-900 border border-gold-500/30 rounded-2xl p-4 sm:p-5 mb-6 shadow-gold-glow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">
              {language === 'hi' ? 'चयनित ज्योतिषीय परामर्श' : 'Consultation Selected'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white font-heading">{localizedServiceName}</h2>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-gold-400">₹{activeService.price}</div>
            <span className="text-[10px] text-gray-400 block">
              {t('serviceDeliveryLabel')} {localizedDeliveryTime}
            </span>
          </div>
        </div>

        {/* Dropdown service switcher in ascending order */}
        {allServices.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="checkout-service-switcher"
              className="text-xs text-gray-300 font-medium flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'परामर्श सेवा बदलें (आरोही क्रम ₹49 से):'
                  : 'Switch Consultation (Ascending Order):'}
              </span>
            </label>
            <select
              id="checkout-service-switcher"
              value={serviceSlug}
              onChange={(e) => {
                const newSlug = e.target.value;
                router.push(`/checkout/${newSlug}`);
              }}
              className="bg-navy-950 border border-gold-500/40 rounded-xl px-3 py-1.5 text-xs text-gold-300 font-bold focus:outline-none focus:ring-1 focus:ring-gold-400 cursor-pointer max-w-full sm:max-w-xs"
            >
              {allServices.map((s) => (
                <option key={s.id} value={s.slug} className="bg-navy-900 text-white py-1">
                  ₹{s.price} • {language === 'hi' && HINDI_SERVICES[s.slug] ? HINDI_SERVICES[s.slug].name : s.name} {s.price === 499 ? (language === 'hi' ? '[आगामी]' : '[Coming Soon]') : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {paymentError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}

      {/* STEP 1: SIGN UP / SIGN IN (Sequential Flow) */}
      {step === 1 && (
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {currentUser ? (
            /* Logged in state */
            <div className="space-y-6">
              <div className="mb-2">
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block mb-1">
                  {language === 'hi' ? 'चरण 1: खाता सत्यापन' : 'Step 1: Account Verification'}
                </span>
                <h1 className="text-xl font-black text-white font-heading">
                  {language === 'hi' ? 'सत्यापित खाते से जुड़े हैं' : 'Connected with Verified Account'}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'hi'
                    ? 'आप पहले से लॉगिन हैं। अपनी जन्म कुंडली विवरण भरने के लिए आगे बढ़ें।'
                    : 'You are signed in. Proceed to enter your Kundli birth coordinates.'}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-navy-950 border border-emerald-500/40 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                          {language === 'hi' ? 'सत्यापित जातक' : 'Verified Seeker'}
                        </span>
                      </div>
                      <strong className="text-white text-sm block font-heading">{currentUser.name}</strong>
                      <div className="text-xs text-gray-300 font-mono mt-0.5">
                        {currentUser.email} • {currentUser.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser(null);
                      setAuthMode('login');
                    }}
                    className="text-xs text-gold-400 hover:text-gold-300 font-semibold underline shrink-0"
                  >
                    {language === 'hi' ? 'अन्य खाता' : 'Switch'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>{language === 'hi' ? 'जन्म विवरण के लिए आगे बढ़ें' : 'Continue to Birth Details'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Not logged in: Tabbed Sign Up / Login Form */
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block mb-1">
                  {language === 'hi' ? 'चरण 1: खाता बनाएं अथवा लॉगिन करें' : 'Step 1: Sign Up or Sign In'}
                </span>
                <h1 className="text-xl font-black text-white font-heading">
                  {authMode === 'signup'
                    ? (language === 'hi' ? 'नया खाता बनाएं' : 'Create Your Account')
                    : (language === 'hi' ? 'अपने खाते में लॉगिन करें' : 'Sign In to Your Account')}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'hi'
                    ? 'आपकी व्यक्तिगत जन्म कुंडली रिपोर्ट आपके खाते में सुरक्षित रूप से संरक्षित रहेगी।'
                    : 'Your personalized Vedic horoscope report will be permanently saved in your dashboard.'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-2xl bg-navy-950 p-1 border border-navy-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    authMode === 'signup'
                      ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {language === 'hi' ? 'नया खाता बनाएं (Sign Up)' : 'Sign Up (New User)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {language === 'hi' ? 'लॉगिन करें (Sign In)' : 'Sign In (Existing User)'}
                </button>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authMode === 'signup' ? (
                /* Sign Up Form */
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      {t('fullNameLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('fullNamePlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.name && <p className="text-[11px] text-red-400 mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      {t('emailLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('emailPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.email && <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      {t('phoneLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('phonePlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.phone && <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>}
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {t('phoneNote')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      {language === 'hi' ? 'पासवर्ड बनाएं (सुरक्षित लॉगिन हेतु)' : 'Create Password (min 6 characters)'}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.password && <p className="text-[11px] text-red-400 mt-1">{formErrors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-6 disabled:opacity-60"
                  >
                    {authLoading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-navy-950 border-t-transparent" />
                    ) : (
                      <>
                        <span>{language === 'hi' ? 'खाता बनाएं एवं जन्म विवरण भरें' : 'Sign Up & Continue to Birth Details'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      {t('emailLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('emailPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.email && <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      {language === 'hi' ? 'पासवर्ड' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.password && <p className="text-[11px] text-red-400 mt-1">{formErrors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-6 disabled:opacity-60"
                  >
                    {authLoading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-navy-950 border-t-transparent" />
                    ) : (
                      <>
                        <span>{language === 'hi' ? 'लॉगिन करें एवं जारी रखें' : 'Sign In & Continue to Birth Details'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: BIRTH DETAILS */}
      {step === 2 && (
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block mb-1">
              {language === 'hi' ? 'चरण 2: जन्म विवरण' : 'Step 2: Birth Details'}
            </span>
            <h1 className="text-xl font-black text-white font-heading">
              {t('step2Heading')}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {t('step2Subheading')}
            </p>
          </div>

          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{t('accuracyWarningTitle')}</strong> {t('accuracyWarningText')}
            </p>
          </div>

          <form onSubmit={handleNextToSummary} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {t('dobLabel')}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
                {formErrors.dateOfBirth && <p className="text-[11px] text-red-400 mt-1">{formErrors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {t('tobLabel')}
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="timeOfBirth"
                    value={formData.timeOfBirth}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
                {formErrors.timeOfBirth && <p className="text-[11px] text-red-400 mt-1">{formErrors.timeOfBirth}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {t('cityLabel')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="birthCity"
                    value={formData.birthCity}
                    onChange={handleChange}
                    placeholder={t('cityPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
                {formErrors.birthCity && <p className="text-[11px] text-red-400 mt-1">{formErrors.birthCity}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {t('countryLabel')}
                </label>
                <input
                  type="text"
                  name="birthCountry"
                  value={formData.birthCountry}
                  onChange={handleChange}
                  placeholder="India"
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {t('genderLabel')}
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:outline-none focus:border-gold-400 transition-colors"
                >
                  <option value="Male">{t('genderMale')}</option>
                  <option value="Female">{t('genderFemale')}</option>
                  <option value="Non-Binary">{t('genderOther')}</option>
                  <option value="Prefer not to say">{t('genderPreferNot')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {t('currentCityLabel')}
                </label>
                <input
                  type="text"
                  name="currentCity"
                  value={formData.currentCity}
                  onChange={handleChange}
                  placeholder={language === 'hi' ? 'उदा. मुंबई' : 'e.g. Mumbai'}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3.5 px-5 rounded-xl bg-navy-800 text-gray-300 hover:bg-navy-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('backBtn')}</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>{language === 'hi' ? 'भुगतान के लिए आगे बढ़ें' : 'Proceed to Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: ORDER SUMMARY & PAYMENT */}
      {step === 3 && (
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block mb-1">
              {language === 'hi' ? 'चरण 3: समीक्षा एवं भुगतान' : 'Step 3: Review & Payment'}
            </span>
            <h1 className="text-xl font-black text-white font-heading">
              {t('step3Heading')}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {t('step3Subheading')}
            </p>
          </div>

          <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-5 space-y-3 mb-6">
            <div className="flex justify-between text-xs py-1 border-b border-navy-800">
              <span className="text-gray-400">{t('summaryService')}</span>
              <strong className="text-white text-right font-heading">{localizedServiceName}</strong>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-navy-800">
              <span className="text-gray-400">{t('summaryFee')}</span>
              <strong className="text-gold-400 text-base font-black">₹{activeService.price}</strong>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-navy-800">
              <span className="text-gray-400">{t('summaryName')}</span>
              <span className="text-white font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-navy-800">
              <span className="text-gray-400">{t('summaryWhatsApp')}</span>
              <span className="text-white font-medium">{formData.phone}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-navy-800">
              <span className="text-gray-400">{t('summaryDob')}</span>
              <span className="text-white font-medium">{formData.dateOfBirth}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-navy-800">
              <span className="text-gray-400">{t('summaryTob')}</span>
              <span className="text-white font-medium">{formData.timeOfBirth}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-gray-400">{t('summaryPlace')}</span>
              <span className="text-white font-medium">{formData.birthCity}, {formData.birthCountry}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={isSubmitting}
              className="py-4 px-5 rounded-xl bg-navy-800 text-gray-300 hover:bg-navy-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('editDetailsBtn')}</span>
            </button>
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-navy-950 border-t-transparent" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{t('proceedPayBtn')} (₹{activeService.price})</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-navy-800 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('sslSecured')}</span>
          </div>
        </div>
      )}

      {/* Test Simulator Modal */}
      {paymentOrder && (
        <PaymentSimulatorModal
          isOpen={showSimulator}
          orderNumber={paymentOrder.orderNumber}
          orderId={paymentOrder.orderId}
          amount={paymentOrder.amount}
          serviceName={localizedServiceName}
          gatewayOrderId={paymentOrder.gatewayOrderId}
          onSuccess={handleVerifyPayment}
          onFailure={(err) => {
            setShowSimulator(false);
            router.push(`/payment/failed?error=${encodeURIComponent(err)}`);
          }}
          onClose={() => {
            setShowSimulator(false);
            setIsSubmitting(false);
          }}
        />
      )}
    </div>
  );
}
