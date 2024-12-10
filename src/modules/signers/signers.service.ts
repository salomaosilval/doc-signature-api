import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSignerDto } from './dto/update-signer.dto';

@Injectable()
export class SignersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.signer.findMany();
  }

  async findOne(id: string) {
    const signer = await this.prisma.signer.findUnique({
      where: { id },
      include: {
        document: true,
      },
    });

    if (!signer) {
      throw new NotFoundException(`Signer with ID ${id} not found`);
    }

    return signer;
  }

  async update(id: string, updateSignerDto: UpdateSignerDto) {
    await this.findOne(id);

    return this.prisma.signer.update({
      where: { id },
      data: updateSignerDto,
    });
  }
}
