import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { ChartData } from '@/lib/astrology/types';
import { AstrologyReportContent } from '@/lib/ai/types';
import OrderDetailReportView from '@/components/report/OrderDetailReportView';

export default async function OrderReportPage({
  params,
}: {
  params: { orderId: string };
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?redirect=/dashboard/orders/${params.orderId}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      service: {
        select: {
          name: true,
          slug: true,
        },
      },
      birthProfile: {
        select: {
          dateOfBirth: true,
          timeOfBirth: true,
          birthCity: true,
        },
      },
      analysis: {
        select: {
          astrologyData: true,
        },
      },
      report: {
        select: {
          title: true,
          content: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Strict Authorization Check
  if (order.userId !== user.id && user.role !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-navy-900 border border-red-500/30 rounded-3xl p-6 text-center max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">Access Restricted</h2>
          <p className="text-xs text-gray-400 mb-4">
            You are not authorized to access this personalized consultation report.
          </p>
          <Link
            href="/dashboard"
            className="py-2.5 px-4 rounded-xl bg-navy-800 text-xs font-semibold text-gray-200"
          >
            Return to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  let chartData: ChartData | null = null;
  let reportContent: AstrologyReportContent | null = null;

  if (order.analysis?.astrologyData) {
    try {
      chartData = JSON.parse(order.analysis.astrologyData);
    } catch (e) {}
  }

  if (order.report?.content) {
    try {
      reportContent = JSON.parse(order.report.content);
    } catch (e) {}
  }

  return (
    <OrderDetailReportView
      order={order}
      chartData={chartData}
      reportContent={reportContent}
    />
  );
}
