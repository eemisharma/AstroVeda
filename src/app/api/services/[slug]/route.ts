import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
    });

    if (service && service.active) {
      return NextResponse.json({ service });
    }

    // Check fallback catalog
    const fallback = FALLBACK_SERVICES.find((s) => s.slug === params.slug);
    if (fallback) {
      return NextResponse.json({ service: fallback });
    }

    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching service slug, checking fallback:', error);
    const fallback = FALLBACK_SERVICES.find((s) => s.slug === params.slug);
    if (fallback) {
      return NextResponse.json({ service: fallback });
    }
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
