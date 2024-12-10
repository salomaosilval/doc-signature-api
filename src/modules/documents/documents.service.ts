import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ZapSignService } from '../zapsign/zapsign.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from '../../shared/enums/document-status.enum';
import { SignerStatus } from '../../shared/enums/signer-status.enum';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly zapSignService: ZapSignService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    const document = await this.prisma.document.create({
      data: {
        name: createDocumentDto.name,
        description: createDocumentDto.description,
        status: DocumentStatus.PENDING,
        fileUrl: createDocumentDto.fileUrl,
        signers: {
          create: createDocumentDto.signers.map((signer) => ({
            name: signer.name,
            email: signer.email,
            status: SignerStatus.PENDING,
          })),
        },
      },
      include: {
        signers: true,
      },
    });

    // Integração com ZapSign
    const zapSignDoc = await this.zapSignService.createDocument({
      name: document.name,
      base64_pdf: document.fileUrl, // Aqui precisaria converter a URL para base64
      signers: document.signers.map((signer) => ({
        name: signer.name,
        email: signer.email,
        send_automatic_email: true,
      })),
    });

    // Atualiza o documento com o ID do ZapSign
    return this.prisma.document.update({
      where: { id: document.id },
      data: {
        zapsignId: zapSignDoc.id,
        status: DocumentStatus.PROCESSING,
      },
      include: {
        signers: true,
      },
    });
  }

  async findAll() {
    return this.prisma.document.findMany({
      include: {
        signers: true,
      },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        signers: true,
        history: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    await this.findOne(id);

    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
      include: {
        signers: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.document.delete({ where: { id } });
  }
}
