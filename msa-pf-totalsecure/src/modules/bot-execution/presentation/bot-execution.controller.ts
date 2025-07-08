import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BotExecutionService } from '../application/bot-execution.service';
import { BotExecutionResponseDto } from '../dto/bot-execution-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReadOnlyGuard } from '../../../common/guards/read-only.guard';
import { ReadOnly } from '../../../common/decorators/read-only.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Bot Execution')
@UseGuards(JwtAuthGuard, ReadOnlyGuard)
@ApiBearerAuth('access-token')
@ReadOnly()
@Controller('bot-executions')
export class BotExecutionController {
  constructor(private readonly service: BotExecutionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ejecuciones de bots con filtros opcionales' })
  @ApiResponse({ status: 200, type: [BotExecutionResponseDto] })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  @Permissions('bot-automation.executions.view')
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.findAll(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ejecución por ID' })
  @ApiResponse({ status: 200, type: BotExecutionResponseDto })
  @Permissions('bot-automation.executions.view')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }
}
