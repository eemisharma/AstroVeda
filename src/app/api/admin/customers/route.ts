import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        _count: {
          select: { orders: true },
        },
        orders: {
          where: { paymentStatus: 'SUCCESS' },
          select: { amount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      totalOrders: c._count.orders,
      totalSpent: c.orders.reduce((acc, curr) => acc + curr.amount, 0),
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ customers: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}
