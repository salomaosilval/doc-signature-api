import * as crypto from 'crypto';

export function validateZapSignWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string,
): boolean {
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const calculatedSignature = hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature),
  );
}
