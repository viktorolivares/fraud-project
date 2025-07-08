import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ConciliationFileService } from '../application/conciliation-file.service';
import { ConciliationFile } from '../domain/conciliation-file.entity';

@Controller('conciliation-files')
export class ConciliationFileController {
  constructor(private readonly conciliationFileService: ConciliationFileService) {}

  @Get()
  async findAll(): Promise<ConciliationFile[]> {
    return this.conciliationFileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ConciliationFile | null> {
    return this.conciliationFileService.findOne(parseInt(id));
  }

  @Get('conciliation/:conciliationId')
  async findByConciliation(@Param('conciliationId') conciliationId: string): Promise<ConciliationFile[]> {
    return this.conciliationFileService.findByConciliation(parseInt(conciliationId));
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string): Promise<ConciliationFile[]> {
    return this.conciliationFileService.findByType(parseInt(type));
  }

  @Post()
  async create(@Body() fileData: Partial<ConciliationFile>): Promise<ConciliationFile> {
    return this.conciliationFileService.create(fileData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() fileData: Partial<ConciliationFile>): Promise<ConciliationFile | null> {
    return this.conciliationFileService.update(parseInt(id), fileData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.conciliationFileService.delete(parseInt(id));
  }
}
