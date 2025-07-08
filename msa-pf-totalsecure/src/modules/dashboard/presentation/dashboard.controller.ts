import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from '../application/dashboard.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // --- SOLO DASHBOARD: KPIs y métricas rápidas ---

  
  @Get('cases-by-state')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Casos por estado' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getCasesByState(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getCasesByState(from, to, channelId);
  }

  @Get('summary-bot-cases')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de casos por bot' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getSummaryBotCases(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getSummaryBotCasesByChannel(from, to, channelId);
  }

  @Get('summary-bot-cases-by-date')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de casos por bot agrupado por fecha' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getSummaryBotCasesByDate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getSummaryBotCasesByDate(from, to, channelId);
  }

  @Get('summary-bot-incidents')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de incidentes por bot' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getSummaryBotIncidents(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getSummaryBotIncidentsByChannel(from, to, channelId);
  }

  @Get('summary-bot-incidents-by-date')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de incidentes por bot agrupado por fecha' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getSummaryBotIncidentsByDate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getSummaryBotIncidentsByDate(from, to, channelId);
  }

  @Get('summary-cases-by-date')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de casos agrupado por fecha' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getSummaryCasesByDate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getSummaryCasesByDate(from, to, channelId);
  }

  @Get('summary-incidents-by-date')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de incidentes agrupado por fecha' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getSummaryIncidentsByDate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getSummaryIncidentsByDate(from, to, channelId);
  }

  @Get('system-summary')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen general del sistema (casos, incidentes, bots, ejecuciones)' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getSystemSummary(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getSystemSummaryByChannel(from, to, channelId);
  }

  @Get('bot-summary-by-date')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de un bot por fecha' })
  @ApiQuery({ name: 'botId', required: true, type: Number })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getBotSummaryByDate(
    @Query('botId') botId: number,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getBotSummaryByDate(botId, from, to, channelId);
  }

  @Get('all-bots-summary-by-date')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Resumen de todos los bots por fecha' })
  @ApiQuery({ name: 'from', required: true, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  @ApiQuery({ name: 'channelId', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getAllBotsSummaryByDate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('channelId') channelIdParam?: string,
  ): Promise<unknown> {
    const channelId = channelIdParam ? parseInt(channelIdParam, 10) : undefined;
    return this.dashboardService.getAllBotsSummaryByDate(from, to, channelId);
  }

  @Get('available-channels')
  @Permissions('reporting-analytics.dashboards.view')
  @ApiOperation({ summary: 'Obtener canales disponibles para filtros' })
  @ApiResponse({ status: 200 })
  async getAvailableChannels(): Promise<unknown> {
    return this.dashboardService.getAvailableChannels();
  }
}
