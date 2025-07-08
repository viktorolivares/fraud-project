// Tipo genérico para resultados de stored procedures
export type StoredProcedureResult = Record<string, string | number | Date | bigint | null>;

// Tipos específicos para cada stored procedure del dashboard
export interface CasesByStateResult extends StoredProcedureResult {
  state: string;
  state_count: number;
  total_count: number;
}

export interface SummaryBotCasesResult extends StoredProcedureResult {
  bot_id: number;
  bot_name: string;
  case_count: number;
}

export interface SummaryBotCasesByDateResult extends StoredProcedureResult {
  bot_id: number;
  bot_name: string;
  case_date: string;
  case_count: number;
}

export interface SystemSummaryResult extends StoredProcedureResult {
  cases_count: number;
  incidents_count: number;
  bots_count: number;
  executions_count: number;
}

export interface BotSummaryByDateResult extends StoredProcedureResult {
  bot_identifier: number;
  bot_name: string;
  capture_date: string;
  unique_users: number;
}

export interface SummaryBotIncidentsResult extends StoredProcedureResult {
  bot_id: number;
  bot_name: string;
  incidents: number;
}

export interface SummaryBotIncidentsByDateResult extends StoredProcedureResult {
  bot_id: number;
  bot_name: string;
  exec_date: string;
  incidents: number;
}

export interface SummaryCasesByDateResult extends StoredProcedureResult {
  date: string;
  case_count: number;
}

export interface SummaryIncidentsByDateResult extends StoredProcedureResult {
  executed_date: string;
  incidents: number;
}

export interface AllBotsSummaryByDateResult extends StoredProcedureResult {
  bot_identifier: number;
  bot_name: string;
  capture_date: string;
  unique_users: number;
}
