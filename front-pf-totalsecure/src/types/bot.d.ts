import { Channel } from './channel';

export interface Bot {
  id: number;
  name: string;
  description?: string | null;
  alertType: string;
  lastRun?: string | null;
  channelId?: number | null;
  channel?: Channel | null;
}

export interface CreateBotDto {
  name: string;
  description?: string | null;
  alertType: string;
  channelId?: number | null;
}

export type UpdateBotDto = Partial<CreateBotDto>;
