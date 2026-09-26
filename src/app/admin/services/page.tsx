'use client';

import { useState, useEffect } from 'react';
import { Layers, Clock, DollarSign, Check, Save } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const loadServices = () => {
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handlePriceChange = (id: string, newPrice: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
  };

  const handleDeliveryChange = (id: string, newDelivery: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, deliveryTime: newDelivery } : s))
    );
  };

  const handleActiveToggle = (id: string, current: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !current } : s))
    );
  };

  const handleSave = async (service: any) => {
    setSavingId(service.id);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          price: service.price,
          deliveryTime: service.deliveryTime,
          active: service.active,
          description: service.description,
        }),
      });
      if (res.ok) {
        setMessage(`Updated "${service.name}" successfully!`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {}
    setSavingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Services & Consultation Pricing
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Update prices, turnaround promises, and visibility in real-time. Changes reflect immediately on public checkout.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-navy-900 border border-navy-800 rounded-3xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{s.name}</h3>
                  <span className="text-[10px] font-mono text-gray-400">{s.slug}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleActiveToggle(s.id, s.active)}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${
                    s.active
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}
                >
                  {s.active ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={s.price}
                    onChange={(e) => handlePriceChange(s.id, Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white font-bold text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={s.deliveryTime}
                    onChange={(e) => handleDeliveryChange(s.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Public Description</label>
                <textarea
                  rows={3}
                  value={s.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setServices((prev) =>
                      prev.map((item) => (item.id === s.id ? { ...item, description: val } : item))
                    );
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs leading-relaxed focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-navy-800">
                <span className="text-[10px] text-gray-400">
                  {s._count?.orders || 0} orders placed
                </span>

                <button
                  onClick={() => handleSave(s)}
                  disabled={savingId === s.id}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xs hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingId === s.id ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
