import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import DashboardOrdersClient from '@/components/dashboard/DashboardOrdersClient';

export default async function DashboardOrdersPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      service: {
        select: {
          name: true,
        },
      },
      report: {
        select: {
          id: true,
        },
      },
      birthProfile: {
        select: {
          dateOfBirth: true,
          timeOfBirth: true,
          birthCity: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <DashboardOrdersClient orders={orders} />;
}
