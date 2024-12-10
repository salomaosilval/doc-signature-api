import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
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
    @Body() webhookData: ZapSignWebhookDto,
  ) {
    // TODO: Implementar validação da assinatura do webhook

    if (webhookData.event_type === 'SIGN' && webhookData.signer_key) {
      await this.signersService.update(webhookData.signer_key, {
        status: SignerStatus.SIGNED,
        signedAt: new Date(webhookData.signature_date),
      });
    }

    if (webhookData.event_type === 'FINISH') {
      await this.documentsService.update(webhookData.doc_key, {
        status: DocumentStatus.COMPLETED,
      });
    }

    return { success: true };
  }
}
