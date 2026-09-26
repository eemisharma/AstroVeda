import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import DashboardProfileClient from '@/components/dashboard/DashboardProfileClient';

export default async function DashboardProfilePage() {
  const user = await getSessionUser();
  if (!user) return null;

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      birthProfiles: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!fullUser) return null;

  return <DashboardProfileClient user={fullUser} />;
}
