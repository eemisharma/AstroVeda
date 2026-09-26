import prisma from '@/lib/db';
import { astrologyProvider } from '@/lib/astrology';
import { aiAnalysisService } from '@/lib/ai/engine';
import { whatsappService } from '@/lib/whatsapp';

export async function processPaidOrder(orderId: string): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      service: true,
      birthProfile: true,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // 1. Mark order as processing
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PROCESSING',
      paymentStatus: 'SUCCESS',
    },
  });

  // 2. Send Payment Confirmation WhatsApp
  await whatsappService.sendPaymentConfirmation({
    userId: order.userId,
    orderId: order.id,
    phone: order.user.phone,
    customerName: order.user.name,
    orderNumber: order.orderNumber,
    serviceName: order.service.name,
  });

  try {
    // 3. Generate Vedic Astrology Chart calculations
    const chartData = await astrologyProvider.generateBirthChart({
      dateOfBirth: order.birthProfile.dateOfBirth,
      timeOfBirth: order.birthProfile.timeOfBirth,
      birthCity: order.birthProfile.birthCity,
      birthCountry: order.birthProfile.birthCountry,
      latitude: order.birthProfile.latitude,
      longitude: order.birthProfile.longitude,
      timezone: order.birthProfile.timezone,
    });

    // 4. Save Astrology Analysis in DB
    await prisma.astrologyAnalysis.upsert({
      where: { orderId: order.id },
      update: {
        astrologyData: JSON.stringify(chartData),
        status: 'COMPLETED',
      },
      create: {
        orderId: order.id,
        astrologyData: JSON.stringify(chartData),
        status: 'COMPLETED',
      },
    });

    // 5. Generate AI Personalized Analysis
    const aiReport = await aiAnalysisService.generateReport({
      customerName: order.user.name,
      serviceName: order.service.name,
      birthDate: order.birthProfile.dateOfBirth,
      birthTime: order.birthProfile.timeOfBirth,
      birthCity: order.birthProfile.birthCity,
      chartData,
    });

    // 6. Save Report
    await prisma.report.upsert({
      where: { orderId: order.id },
      update: {
        title: `${order.service.name} - Personalized Analysis for ${order.user.name}`,
        content: JSON.stringify(aiReport),
        status: 'READY',
      },
      create: {
        orderId: order.id,
        title: `${order.service.name} - Personalized Analysis for ${order.user.name}`,
        content: JSON.stringify(aiReport),
        status: 'READY',
      },
    });

    // 7. Update Order status to ANALYSIS_READY
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'ANALYSIS_READY',
      },
    });

    // 8. Send Analysis Ready WhatsApp Notification
    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'}/dashboard/orders/${order.id}`;
    await whatsappService.sendAnalysisReady({
      userId: order.userId,
      orderId: order.id,
      phone: order.user.phone,
      customerName: order.user.name,
      orderNumber: order.orderNumber,
      serviceName: order.service.name,
      reportUrl,
    });

    return true;
  } catch (err) {
    console.error(`Order processing error for #${order.orderNumber}:`, err);
    // Keep order in PROCESSING/PAID with error status so admin can inspect and retry
    return false;
  }
}
