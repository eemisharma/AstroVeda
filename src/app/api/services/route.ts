import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });

    if (services && services.length > 0) {
      return NextResponse.json({ services });
    }

    // Fallback to official 5 tiers if database is not yet seeded
    return NextResponse.json({ services: FALLBACK_SERVICES });
  } catch (error) {
    console.error('Error fetching services, serving fallback:', error);
    return NextResponse.json({ services: FALLBACK_SERVICES });
  }
}
