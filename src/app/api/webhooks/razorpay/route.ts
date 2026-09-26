import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payment/razorpay';
import prisma from '@/lib/db';
import { processPaidOrder } from '@/lib/orders/processor';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderReceipt = paymentEntity?.notes?.receipt || payload.payload?.order?.entity?.receipt;

      if (orderReceipt) {
        const order = await prisma.order.findUnique({
          where: { orderNumber: orderReceipt },
        });

        if (order && order.status === 'PENDING_PAYMENT') {
          await prisma.payment.upsert({
            where: { orderId: order.id },
            update: {
              status: 'SUCCESS',
              transactionId: paymentEntity?.id || 'webhook_captured',
            },
            create: {
              orderId: order.id,
              provider: 'RAZORPAY',
              transactionId: paymentEntity?.id || 'webhook_captured',
              amount: order.amount,
              currency: order.currency,
              status: 'SUCCESS',
              rawReference: rawBody,
            },
          });

          await processPaidOrder(order.id);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
