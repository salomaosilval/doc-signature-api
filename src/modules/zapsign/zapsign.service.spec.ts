import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ZapSignService } from './zapsign.service';
import { HttpException } from '@nestjs/common';

describe('ZapSignService', () => {
  let service: ZapSignService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZapSignService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ZapSignService>(ZapSignService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDocument', () => {
    const createDocDto = {
      name: 'Test Doc',
      base64_pdf: 'base64string',
      signers: [{ name: 'John', email: 'john@example.com' }],
    };

    it('should create a document successfully', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'doc-123' }),
      });

      const result = await service.createDocument(createDocDto);
      expect(result.id).toBe('doc-123');
    });

    it('should throw HttpException on API error', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      });

      await expect(service.createDocument(createDocDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
