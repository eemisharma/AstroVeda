import prisma from '@/lib/db';
import ServicesListView from '@/components/services/ServicesListView';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

async function getServices() {
  try {
    const list = await prisma.service.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        deliveryTime: true,
      },
    });
    if (list && list.length > 0) {
      return list;
    }
    return FALLBACK_SERVICES;
  } catch (e) {
    return FALLBACK_SERVICES;
  }
}

export default async function ServicesPage() {
  const services = await getServices();
  return <ServicesListView services={services} />;
}
