import prisma from '@/lib/db';
import HomeView from '@/components/home/HomeView';

export const dynamic = 'force-dynamic';

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const services = await getServices();
  return <HomeView services={services} />;
}
