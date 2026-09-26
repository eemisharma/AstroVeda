import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (query && query.trim() !== '') {
      where.OR = [
        { orderNumber: { contains: query.trim() } },
        { user: { name: { contains: query.trim() } } },
        { user: { email: { contains: query.trim() } } },
        { user: { phone: { contains: query.trim() } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        service: true,
        birthProfile: true,
        payment: true,
        report: { select: { id: true, status: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch admin orders' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}
