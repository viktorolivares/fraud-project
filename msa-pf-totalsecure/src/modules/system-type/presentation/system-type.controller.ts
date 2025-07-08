import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SystemTypeService } from '../application/system-type.service';
import { SystemType } from '../domain/system-type.entity';

@Controller('system-types')
export class SystemTypeController {
  constructor(private readonly systemTypeService: SystemTypeService) {}

  @Get()
  async findAll(): Promise<SystemType[]> {
    return this.systemTypeService.findAll();
  }

  @Get('active')
  async findActive(): Promise<SystemType[]> {
    return this.systemTypeService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SystemType | null> {
    return this.systemTypeService.findOne(parseInt(id));
  }

  @Get('table/:tableName')
  async findByTable(@Param('tableName') tableName: string): Promise<SystemType[]> {
    return this.systemTypeService.findByTable(tableName);
  }

  @Get('table/:tableName/column/:columnName')
  async findByTableAndColumn(
    @Param('tableName') tableName: string,
    @Param('columnName') columnName: string
  ): Promise<SystemType[]> {
    return this.systemTypeService.findByTableAndColumn(tableName, columnName);
  }

  @Post()
  async create(@Body() systemTypeData: Partial<SystemType>): Promise<SystemType> {
    return this.systemTypeService.create(systemTypeData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() systemTypeData: Partial<SystemType>): Promise<SystemType | null> {
    return this.systemTypeService.update(parseInt(id), systemTypeData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.systemTypeService.delete(parseInt(id));
  }
}
