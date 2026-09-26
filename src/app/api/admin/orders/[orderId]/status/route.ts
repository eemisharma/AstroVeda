import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { status, paymentStatus } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: params.orderId },
      data: updateData,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update order status' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}
