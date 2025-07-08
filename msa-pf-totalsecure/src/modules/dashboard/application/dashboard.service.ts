import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from '@modules/case/domain/case.entity';
import { CaseIncident } from '@modules/case-incident/domain/case-incident.entity';
import { CaseState } from '@modules/case-state/domain/case-state.entity';
import { BotExecution } from '@modules/bot-execution/domain/bot-execution.entity';
import { Bot } from '@modules/bot/domain/bot.entity';
import { Channel } from '@modules/channel/domain/channel.entity';
import type {
  CasesByStateResult,
  SummaryBotCasesResult,
  SummaryBotCasesByDateResult,
  SystemSummaryResult,
  BotSummaryByDateResult,
  SummaryBotIncidentsResult,
  SummaryBotIncidentsByDateResult,
  SummaryCasesByDateResult,
  SummaryIncidentsByDateResult,
  AllBotsSummaryByDateResult,
} from '../types/dashboard.types';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
    @InjectRepository(CaseIncident)
    private readonly incidentRepository: Repository<CaseIncident>,
    @InjectRepository(CaseState)
    private readonly stateRepository: Repository<CaseState>,
    @InjectRepository(BotExecution)
    private readonly executionRepository: Repository<BotExecution>,
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  /**
   * Helper method to safely convert database results to typed objects
   */
  private mapResult<T>(result: Record<string, unknown>): T {
    const mapped = {} as T;
    for (const [key, value] of Object.entries(result)) {
      (mapped as Record<string, unknown>)[key] = value;
    }
    return mapped;
  }

  /**
   * Helper method to safely get numeric value from database result
   */
  private getNumber(value: unknown): number {
    return typeof value === 'string' ? parseInt(value, 10) : Number(value) || 0;
  }

  /**
   * Helper method to safely get string value from database result
   */
  private getString(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(value);
  }
  private createDateRange(from: string, to: string): { start: Date; end: Date } {
    const start = new Date(from);
    const end = new Date(to);
    // Ensure end date includes the full day
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  /**
   * Build base case query with optional channel filter
   */
  private buildCaseQuery(from: string, to: string, channelId?: number) {
    const { start, end } = this.createDateRange(from, to);
    const query = this.caseRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.state', 'state')
      .leftJoinAndSelect('case.botExecution', 'execution')
      .leftJoinAndSelect('execution.bot', 'bot')
      .leftJoinAndSelect('case.incidents', 'incident')
      .where('case.captureDate BETWEEN :start AND :end', { start, end });

    if (channelId) {
      query.andWhere('incident.channelId = :channelId', { channelId });
    }

    return query;
  }

  /**
   * Build base incident query with optional channel filter
   */
  private buildIncidentQuery(from: string, to: string, channelId?: number) {
    const { start, end } = this.createDateRange(from, to);
    const query = this.incidentRepository
      .createQueryBuilder('incident')
      .leftJoinAndSelect('incident.case', 'case')
      .leftJoinAndSelect('case.botExecution', 'execution')
      .leftJoinAndSelect('execution.bot', 'bot')
      .leftJoinAndSelect('incident.channel', 'channel')
      .where('case.captureDate BETWEEN :start AND :end', { start, end });

    if (channelId) {
      query.andWhere('incident.channelId = :channelId', { channelId });
    }

    return query;
  }

  /**
   * Get cases grouped by state with optional channel filter
   */
  async getCasesByState(from: string, to: string, channelId?: number): Promise<CasesByStateResult[]> {
    try {
      const query = this.buildCaseQuery(from, to, channelId)
        .select([
          'state.name as state',
          'COUNT(case.id) as state_count',
        ])
        .groupBy('state.name');

      const results = await query.getRawMany();
      
      // Calculate total count
      const totalQuery = this.buildCaseQuery(from, to, channelId)
        .select('COUNT(case.id) as total');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const totalResult = await totalQuery.getRawOne();

      return results.map((result: Record<string, unknown>) => ({
        state: this.getString(result['state']),
        state_count: this.getNumber(result['state_count']),
        total_count: this.getNumber((totalResult as Record<string, unknown>)?.['total'] || 0),
      }));
    } catch (error) {
      throw new Error(`Error getting cases by state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of bot cases with optional channel filter
   */
  async getSummaryBotCases(from: string, to: string, channelId?: number): Promise<SummaryBotCasesResult[]> {
    try {
      const query = this.buildCaseQuery(from, to, channelId)
        .select([
          'bot.id as bot_id',
          'bot.name as bot_name',
          'COUNT(DISTINCT case.id) as case_count',
        ])
        .groupBy('bot.id, bot.name')
        .orderBy('case_count', 'DESC');

      const results = await query.getRawMany();
      
      return results.map((result: Record<string, unknown>) => ({
        bot_id: this.getNumber(result['bot_id']),
        bot_name: this.getString(result['bot_name']),
        case_count: this.getNumber(result['case_count']),
      }));
    } catch (error) {
      throw new Error(`Error getting summary bot cases: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of bot cases by date with optional channel filter
   * Devuelve case_date como string yyyy-MM-dd
   */
  async getSummaryBotCasesByDate(from: string, to: string, channelId?: number): Promise<SummaryBotCasesByDateResult[]> {
    try {
      const query = this.buildCaseQuery(from, to, channelId)
        .select([
          'bot.id as bot_id',
          'bot.name as bot_name',
          "TO_CHAR(DATE(case.captureDate), 'YYYY-MM-DD') as case_date",
          'COUNT(DISTINCT case.id) as case_count',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('case_date', 'ASC')
        .addOrderBy('case_count', 'DESC');

      const results = await query.getRawMany();
      
      return results.map((result: Record<string, unknown>) => ({
        bot_id: this.getNumber(result['bot_id']),
        bot_name: this.getString(result['bot_name']),
        case_date: this.getString(result['case_date']),
        case_count: this.getNumber(result['case_count']),
      }));
    } catch (error) {
      throw new Error(`Error getting summary bot cases by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get system summary with optional channel filter
   */
  async getSystemSummary(from: string, to: string, channelId?: number): Promise<SystemSummaryResult[]> {
    try {
      const { start, end } = this.createDateRange(from, to);

      // Count cases
      const casesQuery = this.caseRepository
        .createQueryBuilder('case')
        .where('case.captureDate BETWEEN :start AND :end', { start, end });
      
      if (channelId) {
        casesQuery
          .leftJoin('case.incidents', 'incident')
          .andWhere('incident.channelId = :channelId', { channelId });
      }

      const casesCount = await casesQuery.getCount();

      // Count incidents
      const incidentsQuery = this.incidentRepository
        .createQueryBuilder('incident')
        .leftJoin('incident.case', 'case')
        .where('case.captureDate BETWEEN :start AND :end', { start, end });
      
      if (channelId) {
        incidentsQuery.andWhere('incident.channelId = :channelId', { channelId });
      }

      const incidentsCount = await incidentsQuery.getCount();

      // Count bots (with executions in the date range)
      const botsQuery = this.botRepository
        .createQueryBuilder('bot')
        .leftJoin('bot.executions', 'execution')
        .leftJoin('execution.cases', 'case')
        .where('case.captureDate BETWEEN :start AND :end', { start, end });
      
      if (channelId) {
        botsQuery
          .leftJoin('case.incidents', 'incident')
          .andWhere('incident.channelId = :channelId', { channelId });
      }

      const botsCount = await botsQuery.getCount();

      // Count executions
      const executionsQuery = this.executionRepository
        .createQueryBuilder('execution')
        .leftJoin('execution.cases', 'case')
        .where('case.captureDate BETWEEN :start AND :end', { start, end });
      
      if (channelId) {
        executionsQuery
          .leftJoin('case.incidents', 'incident')
          .andWhere('incident.channelId = :channelId', { channelId });
      }

      const executionsCount = await executionsQuery.getCount();

      return [{
        cases_count: casesCount,
        incidents_count: incidentsCount,
        bots_count: botsCount,
        executions_count: executionsCount,
      }];
    } catch (error) {
      throw new Error(`Error getting system summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get bot summary by date para un bot específico, usuarios únicos por incident.clientId y fecha de case.captureDate
   */
  async getBotSummaryByDate(botId: number, from: string, to: string, channelId?: number): Promise<BotSummaryByDateResult[]> {
    try {
      const { start, end } = this.createDateRange(from, to);
      
      const query = this.caseRepository
        .createQueryBuilder('case')
        .leftJoin('case.botExecution', 'execution')
        .leftJoin('execution.bot', 'bot')
        .leftJoin('case.incidents', 'incident')
        .where('bot.id = :botId', { botId })
        .andWhere('case.captureDate BETWEEN :start AND :end', { start, end });

      if (channelId) {
        query
          .andWhere('incident.channelId = :channelId', { channelId });
      }

      query
        .select([
          'bot.id as bot_identifier',
          'bot.name as bot_name',
          "TO_CHAR(DATE(case.captureDate), 'YYYY-MM-DD') as capture_date",
          'COUNT(DISTINCT incident.clientId) as unique_users',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('capture_date', 'ASC');

      const results = await query.getRawMany();
      
      return results.map((result: Record<string, unknown>) => ({
        bot_identifier: this.getNumber(result['bot_identifier']),
        bot_name: this.getString(result['bot_name']),
        capture_date: this.getString(result['capture_date']),
        unique_users: this.getNumber(result['unique_users']),
      }));
    } catch (error) {
      throw new Error(`Error getting bot summary by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of bot incidents with optional channel filter
   */
  async getSummaryBotIncidents(from: string, to: string, channelId?: number): Promise<SummaryBotIncidentsResult[]> {
    try {
      const query = this.buildIncidentQuery(from, to, channelId)
        .select([
          'bot.id as bot_id',
          'bot.name as bot_name',
          'COUNT(incident.id) as incidents',
        ])
        .groupBy('bot.id, bot.name')
        .orderBy('incidents', 'DESC');

      const results = await query.getRawMany();
      
      return results.map((result: Record<string, unknown>) => ({
        bot_id: this.getNumber(result['bot_id']),
        bot_name: this.getString(result['bot_name']),
        incidents: this.getNumber(result['incidents']),
      }));
    } catch (error) {
      throw new Error(`Error getting summary bot incidents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of bot incidents by date with optional channel filter
   * Devuelve exec_date como string yyyy-MM-dd
   */
  async getSummaryBotIncidentsByDate(from: string, to: string, channelId?: number): Promise<SummaryBotIncidentsByDateResult[]> {
    try {
      const query = this.buildIncidentQuery(from, to, channelId)
        .select([
          'bot.id as bot_id',
          'bot.name as bot_name',
          "TO_CHAR(DATE(case.captureDate), 'YYYY-MM-DD') as exec_date",
          'COUNT(incident.id) as incidents',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('exec_date', 'ASC')
        .addOrderBy('incidents', 'DESC');

      const results = await query.getRawMany();
      
      return results.map((result: Record<string, unknown>) => ({
        bot_id: this.getNumber(result['bot_id']),
        bot_name: this.getString(result['bot_name']),
        exec_date: this.getString(result['exec_date']),
        incidents: this.getNumber(result['incidents']),
      }));
    } catch (error) {
      throw new Error(`Error getting summary bot incidents by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of cases by date with optional channel filter
   * Devuelve date como string yyyy-MM-dd
   */
  async getSummaryCasesByDate(from: string, to: string, channelId?: number): Promise<SummaryCasesByDateResult[]> {
    try {
      const query = this.buildCaseQuery(from, to, channelId)
        .select([
          "TO_CHAR(DATE(case.captureDate), 'YYYY-MM-DD') as date",
          'COUNT(DISTINCT case.id) as case_count',
        ])
        .groupBy('DATE(case.captureDate)')
        .orderBy('date', 'ASC');

      const results = await query.getRawMany();
      
      return results.map((result: Record<string, unknown>) => ({
        date: this.getString(result['date']),
        case_count: this.getNumber(result['case_count']),
      }));
    } catch (error) {
      throw new Error(`Error getting summary cases by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of incidents by date with optional channel filter
   * Devuelve executed_date como string yyyy-MM-dd
   */
  async getSummaryIncidentsByDate(from: string, to: string, channelId?: number): Promise<SummaryIncidentsByDateResult[]> {
    try {
      const query = this.buildIncidentQuery(from, to, channelId)
        .select([
          "TO_CHAR(DATE(case.captureDate), 'YYYY-MM-DD') as executed_date",
          'COUNT(incident.id) as incidents',
        ])
        .groupBy('DATE(case.captureDate)')
        .orderBy('executed_date', 'ASC');

      const results = await query.getRawMany();
      
      return results.map((result: Record<string, unknown>) => ({
        executed_date: this.getString(result['executed_date']),
        incidents: this.getNumber(result['incidents']),
      }));
    } catch (error) {
      throw new Error(`Error getting summary incidents by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of all bots by date con usuarios únicos por client_id de incident y fecha de case.captureDate
   */
  async getAllBotsSummaryByDate(from: string, to: string, channelId?: number): Promise<AllBotsSummaryByDateResult[]> {
    try {
      const { start, end } = this.createDateRange(from, to);

      // Usar incidentes como base para el conteo de usuarios únicos (client_id) y fecha de case.captureDate
      const query = this.incidentRepository
        .createQueryBuilder('incident')
        .leftJoin('incident.case', 'case')
        .leftJoin('case.botExecution', 'execution')
        .leftJoin('execution.bot', 'bot')
        .where('case.captureDate BETWEEN :start AND :end', { start, end });

      if (channelId) {
        query.andWhere('incident.channelId = :channelId', { channelId });
      }

      query
        .select([
          'bot.id as bot_identifier',
          'bot.name as bot_name',
          "TO_CHAR(DATE(case.captureDate), 'YYYY-MM-DD') as capture_date",
          'COUNT(DISTINCT incident.clientId) as unique_users',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('capture_date', 'ASC')
        .addOrderBy('bot.name', 'ASC');

      const results = await query.getRawMany();

      return results.map((result: Record<string, unknown>) => ({
        bot_identifier: this.getNumber(result['bot_identifier']),
        bot_name: this.getString(result['bot_name']),
        capture_date: this.getString(result['capture_date']),
        unique_users: this.getNumber(result['unique_users']),
      }));
    } catch (error) {
      throw new Error(`Error getting all bots summary by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available channels with incident counts
   */
  async getAvailableChannels(): Promise<{ id: number; name: string; description?: string; totalIncidents: number }[]> {
    try {
      const results = await this.channelRepository
        .createQueryBuilder('channel')
        .leftJoin('channel.incidents', 'incident')
        .select([
          'channel.id as id',
          'channel.name as name',
          'channel.description as description',
          'COUNT(incident.id) as totalIncidents',
        ])
        .where('channel.deleted_at IS NULL')
        .groupBy('channel.id, channel.name, channel.description')
        .orderBy('totalIncidents', 'DESC')
        .getRawMany();

      return results.map((result: Record<string, unknown>) => ({
        id: this.getNumber(result['id']),
        name: this.getString(result['name']),
        description: result['description'] ? this.getString(result['description']) : undefined,
        totalIncidents: this.getNumber(result['totalIncidents']),
      }));
    } catch (error) {
      throw new Error(`Error getting available channels: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Legacy methods for backward compatibility (delegate to new implementations)
  async getCasesByStateAndChannel(from: string, to: string, channelId?: number): Promise<CasesByStateResult[]> {
    return this.getCasesByState(from, to, channelId);
  }

  async getSummaryBotCasesByChannel(from: string, to: string, channelId?: number): Promise<SummaryBotCasesResult[]> {
    return this.getSummaryBotCases(from, to, channelId);
  }

  async getSummaryBotIncidentsByChannel(from: string, to: string, channelId?: number): Promise<SummaryBotIncidentsResult[]> {
    return this.getSummaryBotIncidents(from, to, channelId);
  }

  async getSystemSummaryByChannel(from: string, to: string, channelId?: number): Promise<SystemSummaryResult[]> {
    return this.getSystemSummary(from, to, channelId);
  }
}
