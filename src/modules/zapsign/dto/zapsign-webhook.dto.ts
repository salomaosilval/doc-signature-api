export class ZapSignWebhookDto {
  doc_key: string;
  event_type: 'SIGN' | 'FINISH';
  signer_key?: string;
  status: 'signed' | 'closed';
  signature_date?: string;
}
