import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        service: true,
        birthProfile: true,
        payment: true,
        analysis: true,
        report: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // STRICT AUTHORIZATION CHECK
    if (order.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this astrology consultation' },
        { status: 403 }
      );
    }

    // Parse astrologyData and content safely for JSON response
    const parsedAnalysis = order.analysis
      ? {
          ...order.analysis,
          astrologyData: JSON.parse(order.analysis.astrologyData || '{}'),
        }
      : null;

    const parsedReport = order.report
      ? {
          ...order.report,
          content: JSON.parse(order.report.content || '{}'),
        }
      : null;

    return NextResponse.json({
      order: {
        ...order,
        analysis: parsedAnalysis,
        report: parsedReport,
      },
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}
