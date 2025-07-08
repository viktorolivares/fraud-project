// Tipo genérico para resultados de stored procedures
export type StoredProcedureResult = Record<string, string | number | Date | bigint | null>;

// Tipo para casos con datos de cliente enriquecidos
export interface CaseDataWithClientResult extends StoredProcedureResult {
  case_id: number;
  execution_id: number;
  bot_id: number;
  capture_timestamp: string;
  json_data: string;
  client_id: number;
  first_name: string;
  last_name: string;
  email: string;
  national_id_type: string;
  national_id: string;
  birthday: string; // Cambiado de birth_date a birthday según la DB
  calimaco_user: number;
  mvt_id: number;
  calimaco_status: string;
}

// Tipos específicos para cada bot summary
export interface Bot1SummaryResult extends StoredProcedureResult {
  capture_date: string;
  total_events: number;
  unique_clients: number;
  unique_ips: number;
}

export interface Bot2SummaryResult extends StoredProcedureResult {
  capture_date: string;
  total_events: number;
  unique_clients: number;
}

export interface Bot3SummaryResult extends StoredProcedureResult {
  capture_date: string;
  total_logins: number;
  unique_users: number;
  unique_ips: number;
}

export interface Bot4SummaryResult extends StoredProcedureResult {
  updated_date: string;
  unique_clients: number;
}
