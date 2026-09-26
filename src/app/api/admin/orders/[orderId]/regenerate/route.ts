import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { processPaidOrder } from '@/lib/orders/processor';

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    await requireAdmin();

    const success = await processPaidOrder(params.orderId);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to complete analysis regeneration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Analysis and report regenerated successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to regenerate report' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}
