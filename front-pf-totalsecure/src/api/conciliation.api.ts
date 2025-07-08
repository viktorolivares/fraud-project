import axios from '@/lib/api';
import type { Conciliation, CreateConciliationDto, UpdateConciliationDto } from '../types/conciliation';

// Función para obtener todas las conciliaciones
export const getAllConciliations = async () => {
  const { data } = await axios.get('conciliations');
  return data as Conciliation[];
};

// Función para obtener una conciliación por ID
export const getConciliationById = async (id: number) => {
  const { data } = await axios.get(`conciliations/${id}`);
  return data as Conciliation;
};

// Función para crear una nueva conciliación
export const createConciliation = async (conciliation: CreateConciliationDto) => {
  const { data } = await axios.post('conciliations', conciliation);
  return data as Conciliation;
};

// Función para actualizar una conciliación
export const updateConciliation = async (id: number, conciliation: UpdateConciliationDto) => {
  const { data } = await axios.put(`conciliations/${id}`, conciliation);
  return data as Conciliation;
};

// Función para obtener conciliaciones por collector
export const getConciliationsByCollector = async (collectorId: number) => {
  const { data } = await axios.get(`conciliations/collector/${collectorId}`);
  return data as Conciliation[];
};

// Función para obtener conciliaciones por período
export const getConciliationsByPeriod = async (period: string) => {
  const { data } = await axios.get(`conciliations/period/${period}`);
  return data as Conciliation[];
};

// Función para obtener conciliaciones por estado
export const getConciliationsByState = async (state: boolean) => {
  const { data } = await axios.get(`conciliations/state/${state}`);
  return data as Conciliation[];
};

// Función para eliminar una conciliación
export const deleteConciliation = async (id: number) => {
  await axios.delete(`conciliations/${id}`);
};
