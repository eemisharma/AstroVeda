import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const services = await prisma.service.findMany({
      orderBy: { price: 'asc' },
      include: {
        _count: { select: { orders: true } },
      },
    });
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, price, deliveryTime, active, description } = body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(price !== undefined && { price: Number(price) }),
        ...(deliveryTime && { deliveryTime }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(description && { description }),
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update service' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}
