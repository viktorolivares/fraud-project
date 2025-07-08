import axios from '@/lib/api';
import type { Log, CreateLogDto, UpdateLogDto } from '../types/log';

// Función para obtener todos los logs
export const getAllLogs = async () => {
  const { data } = await axios.get('logs');
  return data as Log[];
};

// Función para obtener un log por ID
export const getLogById = async (id: number) => {
  const { data } = await axios.get(`logs/${id}`);
  return data as Log;
};

// Función para crear un nuevo log
export const createLog = async (log: CreateLogDto) => {
  const { data } = await axios.post('logs', log);
  return data as Log;
};

// Función para actualizar un log
export const updateLog = async (id: number, log: UpdateLogDto) => {
  const { data } = await axios.put(`logs/${id}`, log);
  return data as Log;
};

// Función para eliminar un log
export const deleteLog = async (id: number) => {
  await axios.delete(`logs/${id}`);
};
