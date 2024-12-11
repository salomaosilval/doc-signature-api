import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DocumentStatus } from '../../../shared/enums/document-status.enum';

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @IsString()
  @IsOptional()
  zapsignId?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  signedFileUrl?: string;
}
