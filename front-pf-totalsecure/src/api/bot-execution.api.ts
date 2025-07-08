import axios from "@/lib/api";
import type { BotExecution, CreateBotExecutionDto, UpdateBotExecutionDto } from "@/types/bot-execution";

// Función para obtener todas las ejecuciones de bots
export const getAllBotExecutions = async (startDate?: string, endDate?: string) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const url = params.toString() ? `bot-executions?${params.toString()}` : 'bot-executions';
    const { data } = await axios.get<BotExecution[]>(url);
    return data; // La API ya devuelve propiedades en camelCase conforme a la entidad
  } catch (error) {
    console.error('Error fetching bot executions:', error);
    throw error;
  }
};

// Función para obtener una ejecución de bot por ID
export const getBotExecutionById = async (id: number) => {
  try {
    const { data } = await axios.get(`bot-executions/${id}`);
    return data as BotExecution;
  } catch (error) {
    console.error('Error fetching bot execution by ID:', error);
    throw error;
  }
};

// Función para crear una ejecución de bot
export const createBotExecution = async (botExecutionData: CreateBotExecutionDto) => {
  try {
    const { data } = await axios.post('bot-executions', botExecutionData);
    return data as BotExecution;
  } catch (error) {
    console.error('Error creating bot execution:', error);
    throw error;
  }
};

// Función para actualizar una ejecución de bot
export const updateBotExecution = async (id: number, botExecutionData: UpdateBotExecutionDto) => {
  try {
    const { data } = await axios.put(`bot-executions/${id}`, botExecutionData);
    return data as BotExecution;
  } catch (error) {
    console.error('Error updating bot execution:', error);
    throw error;
  }
};

// Función para eliminar una ejecución de bot
export const deleteBotExecution = async (id: number) => {
  try {
    await axios.delete(`bot-executions/${id}`);
  } catch (error) {
    console.error('Error deleting bot execution:', error);
    throw error;
  }
};
