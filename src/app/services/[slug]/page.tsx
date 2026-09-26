import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ServiceDetailView from '@/components/services/ServiceDetailView';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.name} | AstroConsult`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await prisma.service.findUnique({
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

  if (!service || !service.active) {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
