import axios from '@/lib/api';
import type { Collector, CreateCollectorDto, UpdateCollectorDto } from '../types/collector';

// Función para obtener todos los colectores
export const getAllCollectors = async () => {
  const { data } = await axios.get('collectors');
  return data as Collector[];
};

// Función para obtener un colector por ID
export const getCollectorById = async (id: number) => {
  const { data } = await axios.get(`collectors/${id}`);
  return data as Collector;
};

// Función para crear un nuevo colector
export const createCollector = async (collector: CreateCollectorDto) => {
  const { data } = await axios.post('collectors', collector);
  return data as Collector;
};

// Función para actualizar un colector
export const updateCollector = async (id: number, collector: UpdateCollectorDto) => {
  const { data } = await axios.put(`collectors/${id}`, collector);
  return data as Collector;
};

// Función para eliminar un colector
export const deleteCollector = async (id: number) => {
  await axios.delete(`collectors/${id}`);
};
