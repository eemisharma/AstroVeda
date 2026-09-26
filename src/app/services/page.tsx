import prisma from '@/lib/db';
import ServicesListView from '@/components/services/ServicesListView';

async function getServices() {
  try {
    return await prisma.service.findMany({
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
  } catch (e) {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();
  return <ServicesListView services={services} />;
}
