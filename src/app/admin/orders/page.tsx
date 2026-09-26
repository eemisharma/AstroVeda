'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessage(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {}
    setActionLoading(null);
  };

  const handleRegenerate = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/regenerate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Astrology calculations & AI report regenerated successfully!');
        fetchOrders();
      } else {
        alert(data.error || 'Regeneration failed');
      }
    } catch (err) {}
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Consultation Orders Management
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Filter, inspect customer birth coordinates, update fulfillment status, and regenerate AI analyses.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto py-2 px-3 rounded-xl bg-navy-900 border border-navy-700 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-400"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs focus:outline-none focus:border-gold-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="ANALYSIS_READY">ANALYSIS_READY</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gold-400 border-t-transparent mx-auto mb-2" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">
            No orders match the selected criteria.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-gray-400 uppercase border-b border-navy-800 pb-2">
              <tr>
                <th className="py-3 font-semibold">Order</th>
                <th className="py-3 font-semibold">Customer & Birth</th>
                <th className="py-3 font-semibold">Service</th>
                <th className="py-3 font-semibold">Payment</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-gray-300">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-navy-850/40 transition-colors">
                  <td className="py-3.5 font-mono text-gold-300 font-medium align-top">
                    <div>#{o.orderNumber}</div>
                    <div className="text-[10px] text-gray-500 font-sans mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </td>

                  <td className="py-3.5 align-top">
                    <div className="font-semibold text-white">{o.user.name}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gold-400" />
                      <span>{o.user.phone}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      DOB: {o.birthProfile.dateOfBirth} ({o.birthProfile.timeOfBirth}) • {o.birthProfile.birthCity}
                    </div>
                  </td>

                  <td className="py-3.5 align-top">
                    <div className="text-white font-medium">{o.service.name}</div>
                    <div className="text-[10px] text-gray-400">₹{o.amount}</div>
                  </td>

                  <td className="py-3.5 align-top">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 align-top">
                    <select
                      value={o.status}
                      disabled={actionLoading === o.id}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className="px-2 py-1 rounded-lg bg-navy-950 border border-navy-700 text-[11px] text-white focus:outline-none"
                    >
                      <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                      <option value="PAID">PAID</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="ANALYSIS_READY">ANALYSIS_READY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>

                  <td className="py-3.5 text-right align-top space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRegenerate(o.id)}
                        disabled={actionLoading === o.id}
                        title="Regenerate Astrology Chart & AI Analysis"
                        className="p-1.5 rounded-lg bg-navy-800 text-gold-400 hover:bg-navy-700 transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${actionLoading === o.id ? 'animate-spin' : ''}`} />
                      </button>
                      <Link
                        href={`/dashboard/orders/${o.id}`}
                        title="Inspect Customer Report"
                        className="p-1.5 rounded-lg bg-navy-800 text-gray-300 hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
