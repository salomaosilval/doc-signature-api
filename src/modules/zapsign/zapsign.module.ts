import { Module, forwardRef } from '@nestjs/common';
import { ZapSignService } from './zapsign.service';
import { ZapSignWebhookController } from './zapsign-webhook.controller';
import { ConfigModule } from '@nestjs/config';
import { DocumentsModule } from '../documents/documents.module';
import { SignersModule } from '../signers/signers.module';

@Module({
  imports: [ConfigModule, forwardRef(() => DocumentsModule), SignersModule],
  controllers: [ZapSignWebhookController],
  providers: [ZapSignService],
  exports: [ZapSignService],
})
export class ZapSignModule {}
