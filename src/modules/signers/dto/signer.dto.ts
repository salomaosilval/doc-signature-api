import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
