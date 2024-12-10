import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ZapSignSignerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  send_automatic_email?: boolean;

  @IsString()
  @IsOptional()
  custom_message?: string;
}

export class CreateZapSignDocDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  base64_pdf: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ZapSignSignerDto)
  signers: ZapSignSignerDto[];
}
