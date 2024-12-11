export class ZapSignWebhookDto {
  token: string;
  status: 'signed' | 'closed';
  event_type: 'doc_signed';
  signers: Array<{
    token: string;
    status: string;
    name: string;
    email: string;
    signed_at: string;
  }>;
  signed_file: string;
}
