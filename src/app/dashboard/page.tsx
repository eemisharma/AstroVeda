import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import DashboardOverviewClient from '@/components/dashboard/DashboardOverviewClient';

export default async function DashboardOverviewPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      service: {
        select: {
          name: true,
          slug: true,
        },
      },
      report: {
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <DashboardOverviewClient orders={orders} />;
}
