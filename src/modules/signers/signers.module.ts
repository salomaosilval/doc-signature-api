import { Module } from '@nestjs/common';
import { SignersService } from './signers.service';
import { SignersController } from './signers.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SignersController],
  providers: [SignersService],
  exports: [SignersService],
})
export class SignersModule {}
