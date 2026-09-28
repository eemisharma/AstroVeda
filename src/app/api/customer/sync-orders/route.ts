import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { orderStore } from '@/lib/orders/order-store';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    const body = await req.json();
    const localOrders = body.orders || [];

    if (!Array.isArray(localOrders) || localOrders.length === 0) {
      return NextResponse.json({ success: true, synced: 0 });
    }

    let syncedCount = 0;

    for (const lo of localOrders) {
      if (!lo || (!lo.id && !lo.orderNumber)) continue;

      const orderIdentifier = lo.id || lo.orderNumber;

      try {
        const existingOrder = await prisma.order.findFirst({
          where: {
            OR: [
              { id: orderIdentifier },
              { orderNumber: orderIdentifier },
            ],
          },
          include: {
            birthProfile: true,
          },
        });

        if (existingOrder) {
          if (existingOrder.userId !== user.id) {
            await prisma.order.update({
              where: { id: existingOrder.id },
              data: { userId: user.id },
            });
            syncedCount++;
          }
          // If birth profile details were missing on server, update from client
          if (lo.birthProfile && existingOrder.birthProfile) {
            if (!existingOrder.birthProfile.birthCity || existingOrder.birthProfile.birthCity === 'Custom Birthplace') {
              await prisma.birthProfile.update({
                where: { id: existingOrder.birthProfile.id },
                data: {
                  dateOfBirth: lo.birthProfile.dateOfBirth || existingOrder.birthProfile.dateOfBirth,
                  timeOfBirth: lo.birthProfile.timeOfBirth || existingOrder.birthProfile.timeOfBirth,
                  birthCity: lo.birthProfile.birthCity || existingOrder.birthProfile.birthCity,
                },
              });
            }
          }
        } else {
          // If order is in orderStore, update its owner
          const stored = orderStore.getOrder(orderIdentifier);
          if (stored) {
            stored.user = {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
            };
            orderStore.saveOrder(stored);
            syncedCount++;
          }
        }
      } catch (err) {
        console.warn('Error syncing individual order:', err);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
    });
  } catch (error) {
    console.error('Order sync error:', error);
    return NextResponse.json({ error: 'Failed to sync orders' }, { status: 500 });
  }
}
