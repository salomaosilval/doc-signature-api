import { Module, forwardRef } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ZapSignModule } from '../zapsign/zapsign.module';

@Module({
  imports: [PrismaModule, forwardRef(() => ZapSignModule)],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
