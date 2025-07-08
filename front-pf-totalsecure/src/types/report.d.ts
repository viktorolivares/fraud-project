export interface Bot1IncidentJsonData {
  key_number: string;
  case_number: string;
  ip: string;
  user: number;
  player_id: string;
  first_name: string;
  last_name: string;
  email: string;
  creation_date: string;
  modification_date: string;
  status: string;
  national_id_type: string;
  national_id: string;
  nationality: string;
  mobile: string;
  birthday: string;
  verification_flag: number;
  verification_type: string | null;
  ip_count: number;
  deposit_count: number | null;
  withdrawal_count: number | null;
  balance: number;
  similarity: number;
  similarity_value: number;
  similarity_emails: string;
}

export interface Bot1Incident {
  case_id: number;
  execution_id: number;
  bot_id: number;
  capture_timestamp: string;
  json_data: Bot1IncidentJsonData;
}

export interface Bot2IncidentJsonData {
  key_number: string;
  case_number: string;
  player_id: string;
  user: number;
  first_name: string;
  last_name: string;
  email: string;
  national_id: string;
  national_id_type: string;
  birthday: string;
  status: string;
  creation_date: string;
  withdrawal_count: number | null;
  deposit_count: number | null;
  flag_promotion: number;
  flag_promotion_redeemed: number;
}

export interface Bot2Incident {
  case_id: number;
  execution_id: number;
  bot_id: number;
  capture_timestamp: string;
  json_data: Bot2IncidentJsonData;
}

export interface Bot3IncidentJsonData {
  user: number;
  first_name: string;
  last_name: string;
  email: string;
  national_id_type: string;
  national_id: string;
  birthday: string;
  ip: string;
  login_date: string;
  regulatory_status: string;
}

export interface Bot3Incident {
  case_id: number;
  execution_id: number;
  bot_id: number;
  capture_timestamp: string;
  json_data: Bot3IncidentJsonData;
}

export interface Bot4IncidentJsonData {
  user: number;
  Idplayer: string;
  "Nombres y Apellidos": string;
  F_registro: string;
  amount: number;
  method: string;
  type: string;
  status: string;
  updated_date: string;
  first_name: string;
  last_name: string;
  email: string;
  national_id_type: string;
  national_id: string;
  birthday: string;
  z_score: number;
  percent_deviation: number;
  Observaciones: string;
}

export interface Bot4Incident {
  case_id: number;
  execution_id: number;
  bot_id: number;
  capture_timestamp: string;
  json_data: Bot4IncidentJsonData;
}

export interface Bot1Summary {
  capture_date: string;
  total_events: number;
  unique_clients: number;
  unique_ips: number;
}

export interface Bot2Summary {
  capture_date: string;
  total_events: number;
  unique_clients: number;
}

export interface Bot3Summary {
  capture_date: string;
  total_logins: number;
  unique_users: number;
  unique_ips: number;
}
