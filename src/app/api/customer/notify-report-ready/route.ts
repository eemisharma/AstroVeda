import { NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNumber, orderId, phone, customerName, serviceName } = body;

    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'}/dashboard/orders/${orderId || orderNumber}`;

    // Dispatch WhatsApp Notification to Customer's mobile number
    if (phone || orderId) {
      let targetPhone = phone;
      let targetName = customerName || 'प्रिय जातक';
      let targetService = serviceName || 'वैदिक जन्म पत्रिका';

      if (!targetPhone && orderId) {
        try {
          const ord = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true, service: true },
          });
          if (ord) {
            targetPhone = ord.user?.phone;
            targetName = ord.user?.name || targetName;
            targetService = ord.service?.name || targetService;
          }
        } catch {}
      }

      if (targetPhone) {
        await whatsappService.sendAnalysisReady({
          userId: 'customer-notify',
          orderId,
          phone: targetPhone,
          customerName: targetName,
          orderNumber: orderNumber || 'ASTRO-REPORT',
          serviceName: targetService,
          reportUrl,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Push notification and WhatsApp notification sent successfully',
    });
  } catch (err: any) {
    console.warn('Error in notify-report-ready API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
