import { DocumentStatus } from '../../../shared/enums/document-status.enum';
import { SignerResponseDto } from '../../signers/dto/signer-response.dto';

export class DocumentResponseDto {
  id: string;
  name: string;
  description?: string;
  status: DocumentStatus;
  zapsignId?: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  signers?: SignerResponseDto[];
}
