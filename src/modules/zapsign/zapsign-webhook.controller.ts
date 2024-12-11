import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { validateZapSignWebhookSignature } from '../../shared/utils/webhook-signature.util';
import { ZapSignWebhookDto } from './dto/zapsign-webhook.dto';
import { DocumentsService } from '../documents/documents.service';
import { SignersService } from '../signers/signers.service';
import { DocumentStatus } from '../../shared/enums/document-status.enum';
import { SignerStatus } from '../../shared/enums/signer-status.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

@ApiTags('zapsign')
@Controller('webhooks/zapsign')
export class ZapSignWebhookController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly signersService: SignersService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Webhook para eventos do ZapSign' })
  @ApiResponse({ status: 200, description: 'Evento processado com sucesso' })
  @ApiHeader({
    name: 'x-zapsign-signature',
    description: 'Assinatura de verificação do ZapSign',
  })
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('x-zapsign-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
    @Body() webhookData: ZapSignWebhookDto,
  ) {
    const webhookSecret = this.configService.get<string>(
      'ZAPSIGN_WEBHOOK_SECRET',
    );
    const rawBody = request.rawBody?.toString() || JSON.stringify(webhookData);

    if (!signature || !webhookSecret) {
      throw new UnauthorizedException(
        'Assinatura do webhook ausente ou inválida',
      );
    }

    const isValid = validateZapSignWebhookSignature(
      rawBody,
      signature,
      webhookSecret,
    );

    if (!isValid) {
      throw new UnauthorizedException('Assinatura do webhook inválida');
    }

    for (const signer of webhookData.signers) {
      if (signer.status === 'signed') {
        await this.signersService.update(signer.token, {
          status: SignerStatus.SIGNED,
          signedAt: new Date(signer.signed_at),
        });
      }
    }

    if (webhookData.status === 'signed') {
      const document = await this.documentsService.findByZapSignId(
        webhookData.token,
      );
      if (document) {
        await this.documentsService.update(document.id, {
          status: DocumentStatus.COMPLETED,
          signedFileUrl: webhookData.signed_file,
        });
      }
    }

    return { success: true };
  }
}
