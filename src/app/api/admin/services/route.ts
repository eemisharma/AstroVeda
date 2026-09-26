import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const FALLBACK_SERVICES = [
  {
    id: 'srv-1',
    name: 'Quick Kundli Glance & Planetary Insights',
    slug: 'quick-kundli-glance',
    description: 'Rapid Vedic calculation of your Ascendant (Lagna), Moon sign, 9 planetary positions, and active dasha snapshot.',
    price: 49,
    currency: 'INR',
    deliveryTime: '30 mins',
    active: true,
    _count: { orders: 18 },
  },
  {
    id: 'srv-2',
    name: 'Life Direction & Transit Guide',
    slug: 'life-direction-transit',
    description: 'Focused planetary transit analysis covering your immediate life questions across career, emotional harmony, and major timings.',
    price: 89,
    currency: 'INR',
    deliveryTime: '30 mins',
    active: true,
    _count: { orders: 12 },
  },
  {
    id: 'srv-3',
    name: 'Comprehensive Destiny & House Analysis',
    slug: 'comprehensive-destiny',
    description: 'In-depth 12-house reading, wealth yogas, career trajectory, relationship compatibility dynamics, and 2-year forecast.',
    price: 99,
    currency: 'INR',
    deliveryTime: '30 mins',
    active: true,
    _count: { orders: 25 },
  },
  {
    id: 'srv-4',
    name: 'Deep Vedic Kundli + Live WhatsApp Consultation',
    slug: 'vedic-kundli-whatsapp',
    description: 'Complete 10-section Vedic horoscope analysis report with immediate direct WhatsApp chat consultation with an expert astrologer upon payment.',
    price: 149,
    currency: 'INR',
    deliveryTime: 'Instant on WhatsApp',
    active: true,
    _count: { orders: 34 },
  },
  {
    id: 'srv-5',
    name: 'AstroVeda Master Horoscope & Remedial Blueprint [Premium - Coming Soon]',
    slug: 'premium-master-horoscope',
    description: 'All-inclusive master compendium covering every life domain, dosha shanti, gemstone & rudraksha recommendations, and custom Vedic remedial product bundle.',
    price: 499,
    currency: 'INR',
    deliveryTime: 'Coming Soon / Pre-book',
    active: true,
    _count: { orders: 5 },
  },
];

export async function GET() {
  try {
    await requireAdmin();
    let services: any[] = [];
    try {
      services = await prisma.service.findMany({
        orderBy: { price: 'asc' },
        include: {
          _count: { select: { orders: true } },
        },
      });
    } catch (dbErr) {
      console.warn('Prisma services query failed, using fallback services', dbErr);
    }
    if (!services || services.length === 0) {
      services = FALLBACK_SERVICES;
    }
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
