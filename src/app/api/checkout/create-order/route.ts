import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getSessionUser, hashPassword } from '@/lib/auth';
import { createPaymentOrder } from '@/lib/payment/razorpay';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

const checkoutSchema = z.object({
  serviceSlug: z.string(),
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid 10-digit WhatsApp phone number'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid Date of Birth (YYYY-MM-DD) is required'),
  timeOfBirth: z.string().min(3, 'Exact birth time is required for accurate Kundli calculations'),
  birthCity: z.string().min(2, 'Birth city is required'),
  birthCountry: z.string().default('India'),
  gender: z.string().optional(),
  currentCity: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  utm_content: z.string().optional().nullable(),
  fbclid: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    const fallbackService =
      FALLBACK_SERVICES.find((s) => s.slug === validated.serviceSlug) ||
      FALLBACK_SERVICES.find((s) => s.price === 99) ||
      FALLBACK_SERVICES[2];

    let orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let orderNumber = `ASTRO-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    let resolvedService = {
      id: fallbackService.id,
      name: fallbackService.name,
      price: fallbackService.price,
      currency: fallbackService.currency,
      slug: fallbackService.slug,
    };

    // Attempt database persistence (if Prisma and database are available)
    try {
      let service = await prisma.service.findUnique({
        where: { slug: validated.serviceSlug },
      });

      if (!service) {
        try {
          service = await prisma.service.upsert({
            where: { slug: fallbackService.slug },
            update: {
              name: fallbackService.name,
              description: fallbackService.description,
              price: fallbackService.price,
              currency: fallbackService.currency,
              deliveryTime: fallbackService.deliveryTime,
              active: true,
            },
            create: {
              name: fallbackService.name,
              slug: fallbackService.slug,
              description: fallbackService.description,
              price: fallbackService.price,
              currency: fallbackService.currency,
              deliveryTime: fallbackService.deliveryTime,
              active: true,
            },
          });
        } catch {}
      }

      if (service && service.active) {
        resolvedService = {
          id: service.id,
          name: service.name,
          price: service.price,
          currency: service.currency,
          slug: service.slug,
        };

        const sessionUser = await getSessionUser();
        let userId: string;

        if (sessionUser) {
          userId = sessionUser.id;
        } else {
          let existing = await prisma.user.findUnique({
            where: { email: validated.email.toLowerCase().trim() },
          });

          if (!existing) {
            const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
            const passwordHash = await hashPassword(tempPassword);
            existing = await prisma.user.create({
              data: {
                name: validated.name.trim(),
                email: validated.email.toLowerCase().trim(),
                phone: validated.phone.trim(),
                passwordHash,
                role: 'CUSTOMER',
              },
            });
          }
          userId = existing.id;
        }

        const birthProfile = await prisma.birthProfile.create({
          data: {
            userId,
            dateOfBirth: validated.dateOfBirth,
            timeOfBirth: validated.timeOfBirth,
            birthCity: validated.birthCity,
            birthCountry: validated.birthCountry || 'India',
            gender: validated.gender || null,
            currentCity: validated.currentCity || null,
            latitude: validated.latitude || null,
            longitude: validated.longitude || null,
            timezone: 'Asia/Kolkata',
          },
        });

        const createdOrder = await prisma.order.create({
          data: {
            orderNumber,
            userId,
            serviceId: resolvedService.id,
            birthProfileId: birthProfile.id,
            amount: resolvedService.price,
            currency: resolvedService.currency || 'INR',
            status: 'PENDING_PAYMENT',
            paymentStatus: 'PENDING',
            utmSource: validated.utm_source || null,
            utmMedium: validated.utm_medium || null,
            utmCampaign: validated.utm_campaign || null,
            utmContent: validated.utm_content || null,
            fbclid: validated.fbclid || null,
          },
        });

        orderId = createdOrder.id;
        orderNumber = createdOrder.orderNumber;
      }
    } catch (dbError) {
      console.warn('Database write bypassed in serverless / cloud mode, using resilient order generation:', dbError);
    }

    // Initiate Payment order with Razorpay or built-in Test Simulator
    const paymentOrder = await createPaymentOrder({
      amountInINR: resolvedService.price,
      orderNumber,
      customerName: validated.name,
      customerEmail: validated.email,
    });

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      amount: resolvedService.price,
      currency: resolvedService.currency,
      serviceName: resolvedService.name,
      gatewayOrderId: paymentOrder.gatewayOrderId,
      isSimulated: paymentOrder.isSimulated,
      keyId: paymentOrder.keyId,
    });
  } catch (error: any) {
    console.error('Checkout create-order error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred while preparing your consultation order' },
      { status: 500 }
    );
  }
}
