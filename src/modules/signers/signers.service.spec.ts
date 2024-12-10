import { Test, TestingModule } from '@nestjs/testing';
import { SignersService } from './signers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { SignerStatus } from '../../shared/enums/signer-status.enum';

describe('SignersService', () => {
  let service: SignersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    signer: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SignersService>(SignersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all signers', async () => {
      const mockSigners = [
        { id: '1', name: 'John', email: 'john@example.com' },
        { id: '2', name: 'Jane', email: 'jane@example.com' },
      ];

      mockPrismaService.signer.findMany.mockResolvedValue(mockSigners);

      const result = await service.findAll();
      expect(result).toEqual(mockSigners);
      expect(mockPrismaService.signer.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a signer if found', async () => {
      const mockSigner = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        document: { id: 'doc-1', name: 'Test Document' },
      };

      mockPrismaService.signer.findUnique.mockResolvedValue(mockSigner);

      const result = await service.findOne('1');
      expect(result).toEqual(mockSigner);
      expect(mockPrismaService.signer.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { document: true },
      });
    });

    it('should throw NotFoundException if signer not found', async () => {
      mockPrismaService.signer.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = {
      status: SignerStatus.SIGNED,
      signedAt: new Date(),
    };

    it('should update a signer successfully', async () => {
      const mockSigner = {
        id: '1',
        name: 'John',
        ...updateDto,
      };

      mockPrismaService.signer.findUnique.mockResolvedValue(mockSigner);
      mockPrismaService.signer.update.mockResolvedValue(mockSigner);

      const result = await service.update('1', updateDto);
      expect(result).toEqual(mockSigner);
      expect(mockPrismaService.signer.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException when updating non-existent signer', async () => {
      mockPrismaService.signer.findUnique.mockResolvedValue(null);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.signer.update).not.toHaveBeenCalled();
    });
  });
});
