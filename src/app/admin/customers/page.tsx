import prisma from '@/lib/db';
import { Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders: {
        where: { paymentStatus: 'SUCCESS' },
        select: { amount: true },
      },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Customer Directory</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Registered astrology consultation clients and order history.
          </p>
        </div>
        <span className="text-xs text-gray-400">{customers.length} total clients</span>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 overflow-x-auto">
        {customers.length === 0 ? (
          <p className="text-xs text-gray-400 py-4">No customers registered yet.</p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-gray-400 uppercase border-b border-navy-800 pb-2">
              <tr>
                <th className="py-3 font-semibold">Name</th>
                <th className="py-3 font-semibold">Email</th>
                <th className="py-3 font-semibold">WhatsApp Phone</th>
                <th className="py-3 font-semibold">Total Orders</th>
                <th className="py-3 font-semibold">Total Spend</th>
                <th className="py-3 font-semibold text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-gray-300">
              {customers.map((c) => {
                const totalSpent = c.orders.reduce((acc, curr) => acc + curr.amount, 0);
                return (
                  <tr key={c.id} className="hover:bg-navy-850/40 transition-colors">
                    <td className="py-3.5 font-bold text-white">{c.name}</td>
                    <td className="py-3.5 text-gray-300">{c.email}</td>
                    <td className="py-3.5 font-mono text-gray-400">{c.phone}</td>
                    <td className="py-3.5 font-semibold text-white">{c._count.orders}</td>
                    <td className="py-3.5 font-bold text-gold-400">₹{totalSpent}</td>
                    <td className="py-3.5 text-right text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
