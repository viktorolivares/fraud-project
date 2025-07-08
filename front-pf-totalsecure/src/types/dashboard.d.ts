export interface DashboardTotals {
  totalUsers: number;
  totalChannels: number;
  totalNewIncidents: number;
  totalExecutionsToday: number;
}

export interface CaseStateApiRow {
  state: string;
  state_count: number;
  total_count: number;
}

export interface SummaryBotCasesRow {
  bot_id: number;
  bot_name: string;
  case_count: number;
}

export interface SummaryBotCasesByDateRow {
  bot_id: number;
  bot_name: string;
  case_date: string;
  case_count: number;
}

export interface SummaryBotIncidentRow {
  bot_id: number;
  bot_name: string;
  incidents: number;
}

export interface SummaryBotIncidentByDateRow {
  bot_id: number;
  bot_name: string;
  exec_date: string;
  incidents: number;
}

export interface SummaryCasesByDateRow {
  date: string;
  case_count: number;
}

export interface SummaryIncidentByDateRow {
  executed_date: string;
  incidents: number;
}

export interface SystemSummaryRow {
  cases_count: number;
  incidents_count: number;
  bots_count: number;
  executions_count: number;
}

export interface BotSummaryByDateRow {
  bot_id: number;
  bot_name: string;
  summary_date: string;
  executions: number;
  cases: number;
  incidents: number;
}

export interface AllBotsSummaryByDateRow {
  bot_id: number;
  bot_name: string;
  summary_date: string;
  executions: number;
  cases: number;
  incidents: number;
}

export interface AllBotsUniqueUsersByDateRow {
  bot_identifier: number;
  bot_name: string;
  capture_date: string;
  unique_users: number;
}
