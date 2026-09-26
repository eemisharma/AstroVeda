import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    const [totalOrders, paidOrders, pendingOrders, readyReports, customersCount, servicesCount] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { paymentStatus: 'SUCCESS' } }),
        prisma.order.count({ where: { paymentStatus: 'PENDING' } }),
        prisma.report.count({ where: { status: 'READY' } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.service.count(),
      ]);

    const revenueResult = await prisma.order.aggregate({
      where: { paymentStatus: 'SUCCESS' },
      _sum: { amount: true },
    });

    const totalRevenue = revenueResult._sum.amount || 0;

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        service: { select: { name: true } },
      },
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        paidOrders,
        pendingOrders,
        readyReports,
        customersCount,
        servicesCount,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden') || error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
