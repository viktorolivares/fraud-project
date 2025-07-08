import axios from '@/lib/api';
import type { SystemType, CreateSystemTypeDto, UpdateSystemTypeDto } from '../types/system-type';

// Función para obtener todos los tipos de sistema
export const getAllSystemTypes = async () => {
  const { data } = await axios.get('system-types');
  return data as SystemType[];
};

// Función para obtener solo los tipos activos
export const getActiveSystemTypes = async () => {
  const { data } = await axios.get('system-types/active');
  return data as SystemType[];
};

// Función para obtener un tipo por ID
export const getSystemTypeById = async (id: number) => {
  const { data } = await axios.get(`system-types/${id}`);
  return data as SystemType;
};

// Función para obtener tipos por tabla
export const getSystemTypesByTable = async (tableName: string) => {
  const { data } = await axios.get(`system-types/table/${tableName}`);
  return data as SystemType[];
};

// Función para obtener tipos por tabla y columna
export const getSystemTypesByTableAndColumn = async (tableName: string, columnName: string) => {
  const { data } = await axios.get(`system-types/table/${tableName}/column/${columnName}`);
  return data as SystemType[];
};

// Función para crear un nuevo tipo de sistema
export const createSystemType = async (systemType: CreateSystemTypeDto) => {
  const { data } = await axios.post('system-types', systemType);
  return data as SystemType;
};

// Función para actualizar un tipo de sistema
export const updateSystemType = async (id: number, systemType: UpdateSystemTypeDto) => {
  const { data } = await axios.put(`system-types/${id}`, systemType);
  return data as SystemType;
};

// Función para eliminar un tipo de sistema
export const deleteSystemType = async (id: number) => {
  await axios.delete(`system-types/${id}`);
};
