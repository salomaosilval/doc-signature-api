import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ZapSignService } from '../zapsign/zapsign.service';
import { DocumentStatus } from '../../shared/enums/document-status.enum';
import { SignerStatus } from '../../shared/enums/signer-status.enum';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prismaService: PrismaService;
  let zapSignService: ZapSignService;

  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockZapSignService = {
    createDocument: jest.fn(),
    getDocumentStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ZapSignService,
          useValue: mockZapSignService,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    zapSignService = module.get<ZapSignService>(ZapSignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDocumentDto = {
      name: 'Test Document',
      description: 'Test Description',
      fileUrl: 'http://test.com/doc.pdf',
      signers: [{ name: 'John Doe', email: 'john@example.com' }],
    };

    const mockCreatedDocument = {
      id: '123',
      name: createDocumentDto.name,
      description: createDocumentDto.description,
      status: DocumentStatus.PENDING,
      fileUrl: createDocumentDto.fileUrl,
      signers: [
        {
          id: '456',
          name: 'John Doe',
          email: 'john@example.com',
          status: SignerStatus.PENDING,
        },
      ],
    };

    it('should create a document successfully', async () => {
      mockPrismaService.document.create.mockResolvedValue(mockCreatedDocument);
      mockZapSignService.createDocument.mockResolvedValue({ id: 'zap-123' });
      mockPrismaService.document.update.mockResolvedValue({
        ...mockCreatedDocument,
        zapsignId: 'zap-123',
        status: DocumentStatus.PROCESSING,
      });

      const result = await service.create(createDocumentDto);

      expect(result.status).toBe(DocumentStatus.PROCESSING);
      expect(result.zapsignId).toBe('zap-123');
      expect(mockPrismaService.document.create).toHaveBeenCalled();
      expect(mockZapSignService.createDocument).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a document if it exists', async () => {
      const mockDocument = {
        id: '123',
        name: 'Test Document',
      };

      mockPrismaService.document.findUnique.mockResolvedValue(mockDocument);

      const result = await service.findOne('123');
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document does not exist', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(null);

      await expect(service.findOne('123')).rejects.toThrow();
    });
  });
});
