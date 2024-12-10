import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateZapSignDocDto } from './dto/create-zapsign-doc.dto';
import { ZAPSIGN_API_URL } from '../../shared/constants';

@Injectable()
export class ZapSignService {
  private readonly apiToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiToken = this.configService.get<string>('ZAPSIGN_API_TOKEN');
  }

  async createDocument(createZapSignDocDto: CreateZapSignDocDto) {
    try {
      const response = await fetch(`${ZAPSIGN_API_URL}/docs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.apiToken,
        },
        body: JSON.stringify(createZapSignDocDto),
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to create document in ZapSign',
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.json();
    } catch (error) {
      throw new HttpException(
        'ZapSign service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDocumentStatus(docId: string) {
    try {
      const response = await fetch(`${ZAPSIGN_API_URL}/docs/${docId}`, {
        headers: {
          Authorization: this.apiToken,
        },
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to get document status from ZapSign',
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.json();
    } catch (error) {
      throw new HttpException(
        'ZapSign service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
