import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateZapSignDocDto } from './dto/create-zapsign-doc.dto';
import { ZAPSIGN_API_URL } from '../../shared/constants';

@Injectable()
export class ZapSignService {
  private readonly apiToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiToken = this.configService.get<string>('ZAPSIGN_API_KEY');
  }

  async createDocument(createZapSignDocDto: CreateZapSignDocDto) {
    try {
      const response = await fetch(`${ZAPSIGN_API_URL}/docs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiToken}`,
        },
        body: JSON.stringify(createZapSignDocDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('ZapSign error:', errorData);
        throw new HttpException(
          `Failed to create document in ZapSign: ${JSON.stringify(errorData)}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.json();
    } catch (error) {
      console.error('Full error:', error);
      throw new HttpException(
        `ZapSign service error: ${error.message}`,
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
      console.error('Full error:', error);
      throw new HttpException(
        `ZapSign service error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
