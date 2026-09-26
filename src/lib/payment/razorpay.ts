import crypto from 'crypto';
import Razorpay from 'razorpay';

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export const isLiveRazorpayConfigured = (): boolean => {
  return (
    Boolean(KEY_ID) &&
    Boolean(KEY_SECRET) &&
    !KEY_ID.includes('placeholder') &&
    !KEY_SECRET.includes('placeholder')
  );
};

let razorpayClient: Razorpay | null = null;
if (isLiveRazorpayConfigured()) {
  razorpayClient = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
  });
}

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

  if (isLiveRazorpayConfigured() && razorpayClient) {
    try {
      const rzpOrder = await razorpayClient.orders.create({
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
        keyId: KEY_ID,
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
    keyId: KEY_ID || 'rzp_test_simulator',
  };
}

export function verifyPaymentSignature(params: {
  gatewayOrderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  // If simulated order in demo mode
  if (params.gatewayOrderId.startsWith('order_sim_')) {
    return params.signature.startsWith('sig_sim_') || params.signature.length >= 10;
  }

  if (!KEY_SECRET || KEY_SECRET.includes('placeholder')) {
    // In dev mode without real secret, accept verification if signature present
    return Boolean(params.signature);
  }

  const generatedSignature = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${params.gatewayOrderId}|${params.paymentId}`)
    .digest('hex');

  return generatedSignature === params.signature;
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET || WEBHOOK_SECRET.includes('placeholder')) {
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}
