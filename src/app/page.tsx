import prisma from '@/lib/db';
import HomeView from '@/components/home/HomeView';
import { FALLBACK_SERVICES } from '@/lib/constants/services';

export const dynamic = 'force-dynamic';

async function getServices() {
  try {
    const list = await prisma.service.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });
    if (list && list.length > 0) {
      return list;
    }
    return FALLBACK_SERVICES;
  } catch (e) {
    return FALLBACK_SERVICES;
  }
}

export default async function HomePage() {
  const services = await getServices();
  return <HomeView services={services} />;
}
