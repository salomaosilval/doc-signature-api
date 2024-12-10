import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SignersService } from './signers.service';
import { UpdateSignerDto } from './dto/update-signer.dto';

@Controller('signers')
export class SignersController {
  constructor(private readonly signersService: SignersService) {}

  @Get()
  findAll() {
    return this.signersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.signersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSignerDto: UpdateSignerDto,
  ) {
    return this.signersService.update(id, updateSignerDto);
  }
}
