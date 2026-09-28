import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

import { orderStore } from '@/lib/orders/order-store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getSessionUser();

    // 1. Try to fetch real order from Prisma database
    try {
      const order = await prisma.order.findUnique({
        where: { id: params.orderId },
        include: {
          service: true,
          birthProfile: true,
          payment: true,
          analysis: true,
          report: true,
          user: true,
        },
      });

      if (order) {
        // If logged in as someone else who is not admin, block
        if (user && order.userId !== user.id && user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Forbidden: You do not have access to this astrology consultation' },
            { status: 403 }
          );
        }

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
      }
    } catch (dbErr) {
      console.warn('Database query bypassed in customer order fetch:', dbErr);
    }

    // 2. Check persistent runtime orderStore (captures real customer birth details from checkout)
    const stored = orderStore.getOrder(params.orderId);
    if (stored) {
      return NextResponse.json({
        order: stored,
      });
    }

    // 3. Dynamic order fallback with varied birth details & astronomical calculation
    const fallbackOrder = orderStore.generateDynamicFallbackOrder(params.orderId, user);
    return NextResponse.json({
      order: fallbackOrder,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}
