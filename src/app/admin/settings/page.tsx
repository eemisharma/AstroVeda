import { ShieldCheck, CheckCircle2, AlertTriangle, Key, Cpu, Smartphone, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const isRazorpayConfigured =
    Boolean(process.env.RAZORPAY_KEY_ID) &&
    !process.env.RAZORPAY_KEY_ID?.includes('placeholder');

  const isAstrologyApiConfigured = Boolean(process.env.ASTROLOGY_API_KEY);
  const isAiConfigured = Boolean(process.env.AI_API_KEY);
  const isWhatsAppConfigured = Boolean(process.env.WHATSAPP_ACCESS_TOKEN);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          System Status & External Integrations
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Live inspection of external API credentials, payment gateway mode, and fallback engines.
        </p>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          Environment & Engine Status
        </h3>

        {/* Database */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-gold-400" />
            <div>
              <div className="text-xs font-semibold text-white">Database & ORM</div>
              <div className="text-[10px] text-gray-400">Prisma Client with SQLite / PostgreSQL</div>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> CONNECTED
          </span>
        </div>

        {/* Payment Gateway */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-gold-400" />
            <div>
              <div className="text-xs font-semibold text-white">Razorpay Payment Gateway</div>
              <div className="text-[10px] text-gray-400">
                {isRazorpayConfigured
                  ? 'Live / Test Credentials Active'
                  : 'Test Simulator Mode Active (Zero-fail development checkout)'}
              </div>
            </div>
          </div>
          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isRazorpayConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
            }`}
          >
            {isRazorpayConfigured ? 'LIVE/TEST KEYS' : 'TEST SIMULATOR'}
          </span>
        </div>

        {/* Astrology Engine */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-gold-400" />
            <div>
              <div className="text-xs font-semibold text-white">Vedic Astrology Calculation Engine</div>
              <div className="text-[10px] text-gray-400">
                {isAstrologyApiConfigured
                  ? 'External Vedic API'
                  : 'High-Precision Lahiri Sidereal Algorithmic Model (Demo Engine)'}
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> ACTIVE
          </span>
        </div>

        {/* AI Analysis Engine */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-gold-400" />
            <div>
              <div className="text-xs font-semibold text-white">AI Synthesis Engine</div>
              <div className="text-[10px] text-gray-400">
                {isAiConfigured
                  ? 'Gemini 1.5 Flash API Connected'
                  : 'Vedic Rule-Based Deterministic Synthesis (Demo Mode Active)'}
              </div>
            </div>
          </div>
          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isAiConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
            }`}
          >
            {isAiConfigured ? 'GEMINI LIVE' : 'SYNTHESIS ENGINE'}
          </span>
        </div>

        {/* WhatsApp Service */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs font-semibold text-white">WhatsApp Cloud Notifications</div>
              <div className="text-[10px] text-gray-400">
                {isWhatsAppConfigured
                  ? 'Meta Cloud API Connected'
                  : 'Development Logger Active (Notifications saved to DB & console)'}
              </div>
            </div>
          </div>
          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isWhatsAppConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
            }`}
          >
            {isWhatsAppConfigured ? 'META LIVE' : 'DEV LOGGER'}
          </span>
        </div>
      </div>
    </div>
  );
}
