import prisma from '@/lib/db';

export interface WhatsAppNotificationParams {
  userId: string;
  orderId?: string;
  phone: string;
  customerName: string;
  orderNumber: string;
  serviceName: string;
  reportUrl?: string;
}

export class WhatsAppService {
  private accessToken?: string;
  private phoneNumberId?: string;
  private supportPhone: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.supportPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '919876543210';
  }

  getSupportLink(prefilledText: string = 'Hello, I have a question regarding my astrology consultation'): string {
    const cleanPhone = this.supportPhone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prefilledText)}`;
  }

  async sendPaymentConfirmation(params: WhatsAppNotificationParams): Promise<boolean> {
    const message = `✨ Namaste ${params.customerName}! Your order #${params.orderNumber} for "${params.serviceName}" has been successfully received and confirmed. Our Vedic calculation engine is preparing your personalized analysis. You will be notified the moment your report is ready.`;

    return this.dispatchMessage({
      userId: params.userId,
      orderId: params.orderId,
      phone: params.phone,
      type: 'ORDER_CONFIRMATION',
      message,
    });
  }

  async sendAnalysisReady(params: WhatsAppNotificationParams): Promise<boolean> {
    const message = `🌟 Pranam ${params.customerName}! Your personalized astrology report for #${params.orderNumber} ("${params.serviceName}") is now ready to view. Access your comprehensive Kundli insights, planetary guidance, and life recommendations here: ${params.reportUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}`;

    return this.dispatchMessage({
      userId: params.userId,
      orderId: params.orderId,
      phone: params.phone,
      type: 'ANALYSIS_READY',
      message,
    });
  }

  private async dispatchMessage(data: {
    userId: string;
    orderId?: string;
    phone: string;
    type: string;
    message: string;
  }): Promise<boolean> {
    let status = 'SENT';

    if (this.accessToken && this.phoneNumberId) {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: data.phone.replace(/[^0-9]/g, ''),
              type: 'text',
              text: { body: data.message },
            }),
          }
        );

        if (!res.ok) {
          console.warn('WhatsApp Cloud API HTTP error:', await res.text());
          status = 'SIMULATED_FAILED';
        }
      } catch (err) {
        console.warn('WhatsApp Cloud API network error:', err);
        status = 'SIMULATED_FAILED';
      }
    } else {
      console.log(`[WHATSAPP NOTIFICATION DISPATCH - DEMO MODE] To: ${data.phone}\nMessage: ${data.message}\n`);
    }

    try {
      await prisma.notification.create({
        data: {
          userId: data.userId,
          orderId: data.orderId,
          channel: 'WHATSAPP',
          type: data.type,
          status,
          message: data.message,
        },
      });
      return true;
    } catch (dbErr) {
      console.error('Failed to log WhatsApp notification to database:', dbErr);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();
