'use client';

import { useState } from 'react';
import { ShieldCheck, Smartphone, CreditCard, Landmark, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface PaymentSimulatorModalProps {
  isOpen: boolean;
  orderNumber: string;
  orderId: string;
  amount: number;
  serviceName: string;
  gatewayOrderId: string;
  onSuccess: (paymentData: { gatewayOrderId: string; paymentId: string; signature: string }) => void;
  onFailure: (error: string) => void;
  onClose: () => void;
}

export default function PaymentSimulatorModal({
  isOpen,
  orderNumber,
  orderId,
  amount,
  serviceName,
  gatewayOrderId,
  onSuccess,
  onFailure,
  onClose,
}: PaymentSimulatorModalProps) {
  const { t, language } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const paymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const signature = `sig_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      onSuccess({
        gatewayOrderId,
        paymentId,
        signature,
      });
    }, 1200);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onFailure(
        language === 'hi'
          ? 'उपयोगकर्ता बैंक सिमुलेशन द्वारा लेनदेन अस्वीकृत किया गया।'
          : 'Transaction was declined by user bank simulation.'
      );
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-navy-900 border border-gold-500/40 rounded-3xl p-6 shadow-gold-glow-lg text-white relative">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                {t('testGatewayTitle')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 border border-gold-500/30 text-gold-300">
                {t('testModeBadge')}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {serviceName}
            </h3>
          </div>
        </div>

        <div className="bg-navy-950/80 border border-navy-800 rounded-2xl p-4 flex items-center justify-between mb-5">
          <div>
            <span className="text-xs text-gray-400">{t('totalPayable')}</span>
            <div className="text-2xl font-black text-white">₹{amount}</div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-gray-400">{t('orderRef')}</span>
            <div className="text-xs font-mono text-gold-400 font-semibold">{orderNumber}</div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="text-xs font-semibold text-gray-400 mb-1">{t('selectMethod')}</div>

          {/* UPI */}
          <div
            onClick={() => setSelectedMethod('upi')}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'upi'
                ? 'bg-navy-800/90 border-gold-400 shadow-gold-glow'
                : 'bg-navy-950/40 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t('methodUpi')}</div>
                <div className="text-[11px] text-gray-400">{t('methodUpiDesc')}</div>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              selectedMethod === 'upi' ? 'border-gold-400 bg-gold-400' : 'border-gray-500'
            }`}>
              {selectedMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />}
            </div>
          </div>

          {/* Card */}
          <div
            onClick={() => setSelectedMethod('card')}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'card'
                ? 'bg-navy-800/90 border-gold-400 shadow-gold-glow'
                : 'bg-navy-950/40 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t('methodCard')}</div>
                <div className="text-[11px] text-gray-400">{t('methodCardDesc')}</div>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              selectedMethod === 'card' ? 'border-gold-400 bg-gold-400' : 'border-gray-500'
            }`}>
              {selectedMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />}
            </div>
          </div>

          {/* Netbanking */}
          <div
            onClick={() => setSelectedMethod('netbanking')}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedMethod === 'netbanking'
                ? 'bg-navy-800/90 border-gold-400 shadow-gold-glow'
                : 'bg-navy-950/40 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t('methodNetbanking')}</div>
                <div className="text-[11px] text-gray-400">{t('methodNetbankingDesc')}</div>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              selectedMethod === 'netbanking' ? 'border-gold-400 bg-gold-400' : 'border-gray-500'
            }`}>
              {selectedMethod === 'netbanking' && <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleSimulateSuccess}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-navy-950 border-t-transparent" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>₹{amount} {t('simulateSuccessBtn')}</span>
          </button>

          <button
            onClick={handleSimulateFailure}
            disabled={isProcessing}
            className="w-full py-2.5 rounded-xl bg-navy-800/80 text-gray-400 hover:text-red-400 hover:bg-navy-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t('simulateFailureBtn')}</span>
          </button>
        </div>

        <div className="mt-4 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{t('sslSimNote')}</span>
        </div>
      </div>
    </div>
  );
}
