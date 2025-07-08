import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ConciliationService } from '../application/conciliation.service';
import { ConciliationResponseDto } from '../dto/conciliation-response.dto';
import { ConciliationCreateDto } from '../dto/conciliation-create.dto';

@Controller('conciliations')
export class ConciliationController {
  constructor(private readonly conciliationService: ConciliationService) {}

  @Get()
  async findAll(): Promise<ConciliationResponseDto[]> {
    return this.conciliationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ConciliationResponseDto> {
    return this.conciliationService.findOne(parseInt(id));
  }

  @Get('collector/:collectorId')
  async findByCollector(@Param('collectorId') collectorId: string): Promise<ConciliationResponseDto[]> {
    return this.conciliationService.findByCollector(parseInt(collectorId));
  }

  @Get('period/:period')
  async findByPeriod(@Param('period') period: string): Promise<ConciliationResponseDto[]> {
    return this.conciliationService.findByPeriod(period);
  }

  @Get('state/:state')
  async findByState(@Param('state') state: string): Promise<ConciliationResponseDto[]> {
    return this.conciliationService.findByState(state === 'true');
  }

  @Post()
  async create(@Body() conciliationData: ConciliationCreateDto): Promise<ConciliationResponseDto> {
    return this.conciliationService.create(conciliationData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() conciliationData: Partial<ConciliationCreateDto>): Promise<ConciliationResponseDto> {
    return this.conciliationService.update(parseInt(id), conciliationData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.conciliationService.delete(parseInt(id));
  }
}
