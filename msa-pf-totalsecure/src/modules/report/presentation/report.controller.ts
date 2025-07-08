import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ReportService } from '../application/report.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Permissions } from 'common/decorators/permissions.decorator';
import type {
  Bot1SummaryResult,
  Bot2SummaryResult,
  Bot3SummaryResult,
  Bot4SummaryResult,
  CaseDataWithClientResult,
} from '././../types/report.types';

@ApiTags('Reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('bot1-summary')
  @Permissions('reporting-analytics.reports.view')
  @ApiOperation({ summary: 'Resumen del Bot 1 - Concentrador IP (eventos, clientes únicos, IPs únicas)' })
  @ApiQuery({ name: 'from', required: true, type: String, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, type: String, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Resumen detallado del Bot 1' })
  async getBot1Summary(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Bot1SummaryResult[]> {
    return this.reportService.getBot1Summary(from, to);
  }

  @Get('bot2-summary')
  @Permissions('reporting-analytics.reports.view')
  @ApiOperation({ summary: 'Resumen del Bot 2 - DNI Correlativos (eventos, clientes únicos)' })
  @ApiQuery({ name: 'from', required: true, type: String, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, type: String, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Resumen detallado del Bot 2' })
  async getBot2Summary(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Bot2SummaryResult[]> {
    return this.reportService.getBot2Summary(from, to);
  }

  @Get('bot3-summary')
  @Permissions('reporting-analytics.reports.view')
  @ApiOperation({ summary: 'Resumen del Bot 3 (logins, usuarios únicos, IPs únicas)' })
  @ApiQuery({ name: 'from', required: true, type: String, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, type: String, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Resumen detallado del Bot 3' })
  async getBot3Summary(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Bot3SummaryResult[]> {
    return this.reportService.getBot3Summary(from, to);
  }

  @Get('bot4-summary')
  @Permissions('reporting-analytics.reports.view')
  @ApiOperation({ summary: 'Resumen del Bot 4 - Depósitos Anómalos (clientes únicos por fecha)' })
  @ApiQuery({ name: 'from', required: true, type: String, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, type: String, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Resumen detallado del Bot 4' })
  async getBot4Summary(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Bot4SummaryResult[]> {
    return this.reportService.getBot4Summary(from, to);
  }

  @Get('case-data-with-clients/:botId')
  @Permissions('reporting-analytics.reports.view')
  @ApiOperation({ summary: 'Casos con datos de cliente enriquecidos para un bot específico' })
  @ApiQuery({ name: 'from', required: true, type: String, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, type: String, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Casos con información completa del cliente' })
  async getCaseDataWithClients(
    @Query('from') from: string,
    @Query('to') to: string,
    @Param('botId') botId: number,
  ): Promise<CaseDataWithClientResult[]> {
    return this.reportService.getCaseDataWithClients(from, to, botId);
  }
}
