import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ServiceDetailView from '@/components/services/ServiceDetailView';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let service: any = null;
  try {
    service = await prisma.service.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {}

  if (!service) {
    service = FALLBACK_SERVICES.find((f) => f.slug === params.slug);
  }

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.name} | AstroVeda`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let service: any = null;
  try {
    service = await prisma.service.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        deliveryTime: true,
        active: true,
      },
    });
  } catch (e) {}

  if (!service) {
    service = FALLBACK_SERVICES.find((f) => f.slug === params.slug);
  }

  if (!service || !service.active) {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
