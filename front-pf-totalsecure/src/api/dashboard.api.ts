import axios from "@/lib/api";
import * as DashboardTypes from '../types/dashboard';

// Interfaces para filtros
interface DashboardFilters {
  from: string;
  to: string;
  channelId?: number;
}

export const getCasesByState = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.CaseStateApiRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/cases-by-state', { params });
  return data as DashboardTypes.CaseStateApiRow[];
};

export const getSummaryBotCases = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.SummaryBotCasesRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/summary-bot-cases', { params });
  return data as DashboardTypes.SummaryBotCasesRow[];
};

export const getSummaryBotCasesByDate = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.SummaryBotCasesByDateRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/summary-bot-cases-by-date', { params });
  return data as DashboardTypes.SummaryBotCasesByDateRow[];
};

export const getSummaryBotIncidents = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.SummaryBotIncidentRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/summary-bot-incidents', { params });
  return data as DashboardTypes.SummaryBotIncidentRow[];
};

export const getSummaryBotIncidentsByDate = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.SummaryBotIncidentByDateRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/summary-bot-incidents-by-date', { params });
  return data as DashboardTypes.SummaryBotIncidentByDateRow[];
}; 

export const getSummaryCasesByDate = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.SummaryCasesByDateRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/summary-cases-by-date', { params });
  return data as DashboardTypes.SummaryCasesByDateRow[];
};

export const getSummaryIncidentsByDate = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.SummaryIncidentByDateRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/summary-incidents-by-date', { params });
  return data as DashboardTypes.SummaryIncidentByDateRow[];
};

export const getSystemSummary = async (from: string, to: string, channelId?: number): Promise<DashboardTypes.SystemSummaryRow[]> => {
  const params: any = { from, to };
  if (channelId) params.channelId = channelId;
  const { data } = await axios.get('/dashboard/system-summary', { params });
  return data as DashboardTypes.SystemSummaryRow[];
};

export const getBotSummaryByDate = async (
  botId: number,
  from: string,
  to: string
): Promise<DashboardTypes.BotSummaryByDateRow[]> => {
  const { data } = await axios.get('/dashboard/bot-summary-by-date', {
    params: { botId, from, to },
  });
  return data as DashboardTypes.BotSummaryByDateRow[];
};

export const getAllBotsSummaryByDate = async (
  from: string,
  to: string
): Promise<DashboardTypes.AllBotsSummaryByDateRow[]> => {
  const { data } = await axios.get('/dashboard/all-bots-summary-by-date', {
    params: { from, to },
  });
  return data as DashboardTypes.AllBotsSummaryByDateRow[];
};

export const getAllBotsUniqueUsersByDate = async (
  from: string,
  to: string
): Promise<DashboardTypes.AllBotsUniqueUsersByDateRow[]> => {
  const { data } = await axios.get('/dashboard/all-bots-summary-by-date', {
    params: { from, to },
  });
  return data as DashboardTypes.AllBotsUniqueUsersByDateRow[];
};




