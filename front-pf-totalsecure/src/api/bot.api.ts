import axios from "@/lib/api";
import type { Bot, CreateBotDto, UpdateBotDto } from '../types/bot';

// API response format for Bot
interface ApiBot {
  id: number;
  name: string;
  description?: string | null;
  alertType: string;
  lastRun?: string | null;
  channelId?: number | null;
  channel?: {
    id: number;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  } | null;
}

// Función para convertir el formato del backend al formato del frontend
const convertToFrontendFormat = (apiBot: ApiBot): Bot => {
  return {
    id: apiBot.id,
    name: apiBot.name,
    description: apiBot.description ?? null,
    alertType: apiBot.alertType,
    lastRun: apiBot.lastRun ?? null,
    channelId: apiBot.channelId ?? null,
    channel: apiBot.channel ? {
      id: apiBot.channel.id,
      name: apiBot.channel.name,
      description: apiBot.channel.description ?? null,
      createdAt: apiBot.channel.createdAt,
      updatedAt: apiBot.channel.updatedAt,
      deletedAt: apiBot.channel.deletedAt ?? null,
    } : null,
  };
};

// Función para crear un bot
export const createBot = async (botData: CreateBotDto): Promise<Bot> => {
  const { data } = await axios.post('bot', botData);
  return convertToFrontendFormat(data as ApiBot);
};

// Función para obtener todos los bots
export const getAllBots = async () => {
  const { data } = await axios.get('bot');
  return (data as ApiBot[]).map(bot => convertToFrontendFormat(bot));
};

// Función para obtener un bot por ID
export const getBotById = async (id: number) => {
  const { data } = await axios.get(`bot/${id}`);
  return convertToFrontendFormat(data as ApiBot);
};

// Función para actualizar un bot
export const updateBot = async (id: number, botData: UpdateBotDto): Promise<Bot> => {
  const { data } = await axios.patch(`bot/${id}`, botData);
  return convertToFrontendFormat(data as ApiBot);
};

// Función para eliminar un bot
export const deleteBot = async (id: number): Promise<void> => {
  await axios.delete(`bot/${id}`);
};
