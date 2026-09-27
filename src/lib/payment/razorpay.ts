import crypto from 'crypto';
import Razorpay from 'razorpay';

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export const isLiveRazorpayConfigured = (): boolean => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  return (
    Boolean(keyId) &&
    Boolean(keySecret) &&
    !keyId.includes('placeholder') &&
    !keySecret.includes('placeholder')
  );
};

export const getRazorpayClient = (): Razorpay | null => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  if (isLiveRazorpayConfigured()) {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return null;
};

export interface CreateOrderResult {
  gatewayOrderId: string;
  amount: number; // in paise
  currency: string;
  isSimulated: boolean;
  keyId: string;
}

export async function createPaymentOrder(params: {
  amountInINR: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
}): Promise<CreateOrderResult> {
  const amountInPaise = Math.round(params.amountInINR * 100);
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const client = getRazorpayClient();

  if (isLiveRazorpayConfigured() && client) {
    try {
      const rzpOrder = await client.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: params.orderNumber,
        notes: {
          customerName: params.customerName,
          customerEmail: params.customerEmail,
        },
      });

      return {
        gatewayOrderId: rzpOrder.id,
        amount: Number(rzpOrder.amount),
        currency: rzpOrder.currency,
        isSimulated: false,
        keyId,
      };
    } catch (err) {
      console.warn('Failed creating order on live Razorpay, falling back to simulator:', err);
    }
  }

  // Simulated gateway order for test mode / development
  const simulatedGatewayId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    gatewayOrderId: simulatedGatewayId,
    amount: amountInPaise,
    currency: 'INR',
    isSimulated: true,
    keyId: keyId || 'rzp_test_simulator',
  };
}

export function verifyPaymentSignature(params: {
  gatewayOrderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  // If simulated order in demo mode
  if (params.gatewayOrderId.startsWith('order_sim_')) {
    return params.signature.startsWith('sig_sim_') || params.signature.length >= 10;
  }

  if (!keySecret || keySecret.includes('placeholder')) {
    // In dev mode without real secret, accept verification if signature present
    return Boolean(params.signature);
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${params.gatewayOrderId}|${params.paymentId}`)
    .digest('hex');

  return generatedSignature === params.signature;
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  if (!webhookSecret || webhookSecret.includes('placeholder')) {
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}
