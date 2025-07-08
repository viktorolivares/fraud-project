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
   * Helper method to parse date strings and create date range for filtering
   */
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
      const totalResult = await totalQuery.getRawOne();

      return results.map(result => ({
        state: result.state,
        state_count: parseInt(result.state_count),
        total_count: parseInt(totalResult.total),
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
      
      return results.map(result => ({
        bot_id: parseInt(result.bot_id),
        bot_name: result.bot_name,
        case_count: parseInt(result.case_count),
      }));
    } catch (error) {
      throw new Error(`Error getting summary bot cases: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of bot cases by date with optional channel filter
   */
  async getSummaryBotCasesByDate(from: string, to: string, channelId?: number): Promise<SummaryBotCasesByDateResult[]> {
    try {
      const query = this.buildCaseQuery(from, to, channelId)
        .select([
          'bot.id as bot_id',
          'bot.name as bot_name',
          'DATE(case.captureDate) as case_date',
          'COUNT(DISTINCT case.id) as case_count',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('case_date', 'ASC')
        .addOrderBy('case_count', 'DESC');

      const results = await query.getRawMany();
      
      return results.map(result => ({
        bot_id: parseInt(result.bot_id),
        bot_name: result.bot_name,
        case_date: result.case_date,
        case_count: parseInt(result.case_count),
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
   * Get bot summary by date for a specific bot
   */
  async getBotSummaryByDate(botId: number, from: string, to: string, channelId?: number): Promise<BotSummaryByDateResult[]> {
    try {
      const { start, end } = this.createDateRange(from, to);
      // LOG de entrada
      console.log('[getBotSummaryByDate] Params:', { botId, from, to, channelId });
      // Query basado en incidentes para obtener client_id correctamente
      const query = this.incidentRepository
        .createQueryBuilder('incident')
        .leftJoin('incident.case', 'case')
        .leftJoin('case.botExecution', 'execution')
        .leftJoin('execution.bot', 'bot')
        .where('bot.id = :botId', { botId })
        .andWhere('case.captureDate BETWEEN :start AND :end', { start, end })
        .andWhere('incident.clientId IS NOT NULL'); // Solo incidentes con client_id

      if (channelId) {
        query.andWhere('incident.channelId = :channelId', { channelId });
      }

      query
        .select([
          'bot.id as bot_identifier',
          'bot.name as bot_name',
          'DATE(case.captureDate) as capture_date',
          'COUNT(DISTINCT incident.clientId) as unique_users',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('capture_date', 'ASC');

      const results = await query.getRawMany();
      // LOG de salida
      console.log('[getBotSummaryByDate] Result count:', results.length, 'First result:', results[0]);
      return results.map(result => ({
        bot_identifier: parseInt(result.bot_identifier),
        bot_name: result.bot_name,
        capture_date: result.capture_date,
        unique_users: parseInt(result.unique_users || '0'),
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
      
      return results.map(result => ({
        bot_id: parseInt(result.bot_id),
        bot_name: result.bot_name,
        incidents: parseInt(result.incidents),
      }));
    } catch (error) {
      throw new Error(`Error getting summary bot incidents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of bot incidents by date with optional channel filter
   */
  async getSummaryBotIncidentsByDate(from: string, to: string, channelId?: number): Promise<SummaryBotIncidentsByDateResult[]> {
    try {
      const query = this.buildIncidentQuery(from, to, channelId)
        .select([
          'bot.id as bot_id',
          'bot.name as bot_name',
          'DATE(case.captureDate) as exec_date',
          'COUNT(incident.id) as incidents',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('exec_date', 'ASC')
        .addOrderBy('incidents', 'DESC');

      const results = await query.getRawMany();
      
      return results.map(result => ({
        bot_id: parseInt(result.bot_id),
        bot_name: result.bot_name,
        exec_date: result.exec_date,
        incidents: parseInt(result.incidents),
      }));
    } catch (error) {
      throw new Error(`Error getting summary bot incidents by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of cases by date with optional channel filter
   */
  async getSummaryCasesByDate(from: string, to: string, channelId?: number): Promise<SummaryCasesByDateResult[]> {
    try {
      const query = this.buildCaseQuery(from, to, channelId)
        .select([
          'DATE(case.captureDate) as date',
          'COUNT(DISTINCT case.id) as case_count',
        ])
        .groupBy('DATE(case.captureDate)')
        .orderBy('date', 'ASC');

      const results = await query.getRawMany();
      
      return results.map(result => ({
        date: result.date,
        case_count: parseInt(result.case_count),
      }));
    } catch (error) {
      throw new Error(`Error getting summary cases by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of incidents by date with optional channel filter
   */
  async getSummaryIncidentsByDate(from: string, to: string, channelId?: number): Promise<SummaryIncidentsByDateResult[]> {
    try {
      const query = this.buildIncidentQuery(from, to, channelId)
        .select([
          'DATE(case.captureDate) as executed_date',
          'COUNT(incident.id) as incidents',
        ])
        .groupBy('DATE(case.captureDate)')
        .orderBy('executed_date', 'ASC');

      const results = await query.getRawMany();
      
      return results.map(result => ({
        executed_date: result.executed_date,
        incidents: parseInt(result.incidents),
      }));
    } catch (error) {
      throw new Error(`Error getting summary incidents by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get summary of all bots by date with optional channel filter
   */
  async getAllBotsSummaryByDate(from: string, to: string, channelId?: number): Promise<AllBotsSummaryByDateResult[]> {
    try {
      const { start, end } = this.createDateRange(from, to);
      
      // Query basado en incidentes para obtener client_id correctamente
      const query = this.incidentRepository
        .createQueryBuilder('incident')
        .leftJoin('incident.case', 'case')
        .leftJoin('case.botExecution', 'execution')
        .leftJoin('execution.bot', 'bot')
        .where('case.captureDate BETWEEN :start AND :end', { start, end })
        .andWhere('incident.clientId IS NOT NULL'); // Solo incidentes con client_id

      if (channelId) {
        query.andWhere('incident.channelId = :channelId', { channelId });
      }

      query
        .select([
          'bot.id as bot_identifier',
          'bot.name as bot_name',
          'DATE(case.captureDate) as capture_date',
          'COUNT(DISTINCT incident.clientId) as unique_users',
        ])
        .groupBy('bot.id, bot.name, DATE(case.captureDate)')
        .orderBy('capture_date', 'ASC')
        .addOrderBy('bot.name', 'ASC');

      const results = await query.getRawMany();
      
      return results.map(result => ({
        bot_identifier: parseInt(result.bot_identifier),
        bot_name: result.bot_name,
        capture_date: result.capture_date,
        unique_users: parseInt(result.unique_users || '0'),
      }));
    } catch (error) {
      throw new Error(`Error getting all bots summary by date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available channels with incident counts
   */
  async getAvailableChannels(): Promise<{ channel_id: number; channel_name: string; channel_description?: string; total_incidents: number }[]> {
    try {
      const results = await this.channelRepository
        .createQueryBuilder('channel')
        .leftJoin('channel.incidents', 'incident')
        .select([
          'channel.id as channel_id',
          'channel.name as channel_name',
          'channel.description as channel_description',
          'COUNT(incident.id) as total_incidents',
        ])
        .groupBy('channel.id, channel.name, channel.description')
        .orderBy('total_incidents', 'DESC')
        .getRawMany();

      return results.map(result => ({
        channel_id: parseInt(result.channel_id),
        channel_name: result.channel_name,
        channel_description: result.channel_description,
        total_incidents: parseInt(result.total_incidents),
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
