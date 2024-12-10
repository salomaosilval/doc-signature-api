import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { SignerStatus } from '../../../shared/enums/signer-status.enum';

export class UpdateSignerDto {
  @IsEnum(SignerStatus)
  @IsOptional()
  status?: SignerStatus;

  @IsString()
  @IsOptional()
  signUrl?: string;

  @IsDateString()
  @IsOptional()
  signedAt?: Date;
}
