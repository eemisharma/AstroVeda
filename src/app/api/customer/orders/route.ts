import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { user: { email: user.email } },
          ...(user.phone ? [{ user: { phone: user.phone } }] : []),
        ],
      },
      include: {
        service: true,
        birthProfile: true,
        report: {
          select: { id: true, title: true, status: true, updatedAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Customer orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
