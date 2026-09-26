import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { verifyPaymentSignature } from '@/lib/payment/razorpay';
import { processPaidOrder } from '@/lib/orders/processor';
import { createToken, TOKEN_NAME } from '@/lib/auth';

const verifySchema = z.object({
  orderId: z.string(),
  gatewayOrderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = verifySchema.parse(body);

    // 1. Verify Payment Signature
    const isValid = verifyPaymentSignature({
      gatewayOrderId: validated.gatewayOrderId,
      paymentId: validated.paymentId,
      signature: validated.signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Payment signature verification failed. Please contact support.' },
        { status: 400 }
      );
    }

    let order: any = null;
    try {
      order = await prisma.order.findUnique({
        where: { id: validated.orderId },
        include: { user: true, service: true, payment: true },
      });

      if (order) {
        // Prevent duplicate processing if already paid
        if (order.status !== 'PENDING_PAYMENT' && order.paymentStatus === 'SUCCESS') {
          return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
            message: 'Order already processed',
          });
        }

        // Record Payment
        await prisma.payment.upsert({
          where: { orderId: order.id },
          update: {
            provider: 'RAZORPAY',
            transactionId: validated.paymentId,
            amount: order.amount,
            currency: order.currency,
            status: 'SUCCESS',
            rawReference: JSON.stringify({
              gatewayOrderId: validated.gatewayOrderId,
              paymentId: validated.paymentId,
              signature: validated.signature,
            }),
          },
          create: {
            orderId: order.id,
            provider: 'RAZORPAY',
            transactionId: validated.paymentId,
            amount: order.amount,
            currency: order.currency,
            status: 'SUCCESS',
            rawReference: JSON.stringify({
              gatewayOrderId: validated.gatewayOrderId,
              paymentId: validated.paymentId,
              signature: validated.signature,
            }),
          },
        });

        // Trigger end-to-end processing (Astrology calculation, AI analysis, Report, WhatsApp)
        await processPaidOrder(order.id);
      }
    } catch (dbErr) {
      console.warn('Database verification write bypassed in cloud mode:', dbErr);
    }

    const orderNumber = order?.orderNumber || `ASTRO-${validated.orderId.slice(-6).toUpperCase()}`;

    const response = NextResponse.json({
      success: true,
      orderId: validated.orderId,
      orderNumber,
    });

    if (order?.user) {
      const token = createToken({
        userId: order.user.id,
        email: order.user.email,
        role: order.user.role,
      });

      response.cookies.set({
        name: TOKEN_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Payment verify error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error?.message || 'Failed to verify payment and process order' },
      { status: 500 }
    );
  }
}
