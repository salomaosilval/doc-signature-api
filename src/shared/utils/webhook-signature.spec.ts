import { validateZapSignWebhookSignature } from './webhook-signature.util';

describe('WebhookSignature', () => {
  it('deve validar uma assinatura correta', () => {
    const payload = JSON.stringify({ event: 'test' });
    const secret = 'teste123';
    const signature = '2f43656b6c2f04f08580a6...';

    const isValid = validateZapSignWebhookSignature(payload, signature, secret);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar uma assinatura incorreta', () => {
    const payload = JSON.stringify({ event: 'test' });
    const secret = 'teste123';
    const signature = 'assinatura_invalida';

    const isValid = validateZapSignWebhookSignature(payload, signature, secret);
    expect(isValid).toBe(false);
  });
});
