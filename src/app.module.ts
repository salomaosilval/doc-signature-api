import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { SignersModule } from './modules/signers/signers.module';
import { ZapSignModule } from './modules/zapsign/zapsign.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    DocumentsModule,
    SignersModule,
    ZapSignModule,
  ],
})
export class AppModule {}
