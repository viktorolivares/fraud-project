import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { LogService } from '../application/log.service';
import { Log } from '../domain/log.entity';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async findAll(@Query('limit') limit?: string): Promise<Log[]> {
    const parsedLimit = limit ? parseInt(limit) : 100;
    return this.logService.findAll(parsedLimit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Log | null> {
    return this.logService.findOne(parseInt(id));
  }

  @Get('table/:tableName')
  async findByTable(
    @Param('tableName') tableName: string,
    @Query('limit') limit?: string
  ): Promise<Log[]> {
    const parsedLimit = limit ? parseInt(limit) : 100;
    return this.logService.findByTable(tableName, parsedLimit);
  }

  @Get('date-range/:startDate/:endDate')
  async findByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Query('limit') limit?: string
  ): Promise<Log[]> {
    const parsedLimit = limit ? parseInt(limit) : 100;
    return this.logService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
      parsedLimit
    );
  }

  @Get('table/:tableName/date-range/:startDate/:endDate')
  async findByTableAndDateRange(
    @Param('tableName') tableName: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Query('limit') limit?: string
  ): Promise<Log[]> {
    const parsedLimit = limit ? parseInt(limit) : 100;
    return this.logService.findByTableAndDateRange(
      tableName,
      new Date(startDate),
      new Date(endDate),
      parsedLimit
    );
  }

  @Post()
  async create(@Body() logData: Partial<Log>): Promise<Log> {
    return this.logService.create(logData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.logService.delete(parseInt(id));
  }

  @Delete('cleanup/:days')
  async deleteOldLogs(@Param('days') days: string): Promise<{ message: string }> {
    await this.logService.deleteOldLogs(parseInt(days));
    return { message: `Logs older than ${days} days have been deleted` };
  }
}
