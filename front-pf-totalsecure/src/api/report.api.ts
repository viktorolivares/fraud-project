import axios from "@/lib/api";

// Tipos de respuesta del backend
export interface Bot1SummaryResult {
  capture_date: string;
  total_events: number;
  unique_clients: number;
  unique_ips: number;
}

export interface Bot2SummaryResult {
  capture_date: string;
  total_events: number;
  unique_clients: number;
}

export interface Bot3SummaryResult {
  capture_date: string;
  total_logins: number;
  unique_users: number;
  unique_ips: number;
}

export interface Bot4SummaryResult {
  updated_date: string;
  unique_clients: number;
}

export interface CaseDataWithClientResult {
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
  calimaco_user?: number;
  mvt_id?: number;
  calimaco_status?: string;
}

// API Functions
export const getBot1Summary = async (from: string, to: string): Promise<Bot1SummaryResult[]> => {
  const { data } = await axios.get<Bot1SummaryResult[]>('reports/bot1-summary', {
    params: { from, to }
  });
  return data;
};

export const getBot2Summary = async (from: string, to: string): Promise<Bot2SummaryResult[]> => {
  const { data } = await axios.get<Bot2SummaryResult[]>('reports/bot2-summary', {
    params: { from, to }
  });
  return data;
};

export const getBot3Summary = async (from: string, to: string): Promise<Bot3SummaryResult[]> => {
  const { data } = await axios.get<Bot3SummaryResult[]>('reports/bot3-summary', {
    params: { from, to }
  });
  return data;
};

export const getBot4Summary = async (from: string, to: string): Promise<Bot4SummaryResult[]> => {
  const { data } = await axios.get<Bot4SummaryResult[]>('reports/bot4-summary', {
    params: { from, to }
  });
  return data;
};

export const getCaseDataWithClients = async (
  from: string, 
  to: string, 
  botId: number
): Promise<CaseDataWithClientResult[]> => {
  const { data } = await axios.get<CaseDataWithClientResult[]>(`reports/case-data-with-clients/${botId}`, {
    params: { from, to }
  });
  return data;
};

// Función genérica para obtener resumen de cualquier bot
export const getBotSummary = async (
  botNumber: 1 | 2 | 3 | 4,
  from: string,
  to: string
): Promise<Bot1SummaryResult[] | Bot2SummaryResult[] | Bot3SummaryResult[] | Bot4SummaryResult[]> => {
  switch (botNumber) {
    case 1:
      return getBot1Summary(from, to);
    case 2:
      return getBot2Summary(from, to);
    case 3:
      return getBot3Summary(from, to);
    case 4:
      return getBot4Summary(from, to);
    default:
      throw new Error(`Bot ${botNumber} no es válido`);
  }
};
