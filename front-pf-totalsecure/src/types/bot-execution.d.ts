export interface BotInfo {
  id: number;
  name: string;
  description?: string;
  alertType: string;
}

export interface BotExecution {
  id: number;
  botId: number;
  executedAt: string;
  totalProcessedRecords: number;
  totalDetectedIncidents: number;
  bot?: BotInfo;
}

export type CreateBotExecutionDto = Omit<BotExecution, 'id'>;
export type UpdateBotExecutionDto = Partial<CreateBotExecutionDto>;
