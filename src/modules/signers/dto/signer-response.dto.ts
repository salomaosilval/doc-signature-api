import { SignerStatus } from '../../../shared/enums/signer-status.enum';

export class SignerResponseDto {
  id: string;
  documentId: string;
  name: string;
  email: string;
  status: SignerStatus;
  signUrl?: string;
  signedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
