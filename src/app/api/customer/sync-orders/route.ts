import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { orderStore } from '@/lib/orders/order-store';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

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
          // If order does not exist in database, persist it so it reflects in the user's dashboard and orders list permanently
          try {
            const targetSlug = lo.service?.slug || 'comprehensive-destiny';
            let service = await prisma.service.findFirst({
              where: {
                OR: [
                  { slug: targetSlug },
                  ...(lo.service?.name ? [{ name: lo.service.name }] : []),
                ],
              },
            });

            if (!service) {
              const defaultService =
                FALLBACK_SERVICES.find((s) => s.slug === targetSlug) || FALLBACK_SERVICES[2];
              service = await prisma.service.upsert({
                where: { slug: defaultService.slug },
                update: {},
                create: {
                  name: defaultService.name,
                  slug: defaultService.slug,
                  description: defaultService.description,
                  price: defaultService.price,
                  currency: defaultService.currency,
                  deliveryTime: defaultService.deliveryTime,
                  active: true,
                },
              });
            }

            const bp = await prisma.birthProfile.create({
              data: {
                userId: user.id,
                dateOfBirth: lo.birthProfile?.dateOfBirth || '1995-05-15',
                timeOfBirth: lo.birthProfile?.timeOfBirth || '12:00',
                birthCity: lo.birthProfile?.birthCity || 'New Delhi',
                birthCountry: lo.birthProfile?.birthCountry || 'India',
                gender: lo.birthProfile?.gender || null,
                currentCity: lo.birthProfile?.currentCity || null,
                timezone: 'Asia/Kolkata',
              },
            });

            await prisma.order.create({
              data: {
                id: lo.id || undefined,
                orderNumber: lo.orderNumber || `ASTRO-${Date.now().toString().slice(-6)}`,
                userId: user.id,
                serviceId: service.id,
                birthProfileId: bp.id,
                amount: lo.amount || service.price,
                currency: 'INR',
                status: lo.status || 'ANALYSIS_READY',
                paymentStatus: 'SUCCESS',
              },
            });
            syncedCount++;
          } catch (createErr) {
            console.warn('Failed to insert missing order in sync:', createErr);
          }

          // Also update in runtime orderStore
          const stored = orderStore.getOrder(orderIdentifier);
          if (stored) {
            stored.user = {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
            };
            orderStore.saveOrder(stored);
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
