import axios from '@/lib/api';
import type { ConciliationFile, CreateConciliationFileDto, UpdateConciliationFileDto } from '../types/conciliation-file';

// Función para obtener todos los archivos de conciliación
export const getAllConciliationFiles = async () => {
  const { data } = await axios.get('conciliation-files');
  return data as ConciliationFile[];
};

// Función para obtener un archivo de conciliación por ID
export const getConciliationFileById = async (id: number) => {
  const { data } = await axios.get(`conciliation-files/${id}`);
  return data as ConciliationFile;
};

// Función para crear un nuevo archivo de conciliación
export const createConciliationFile = async (conciliationFile: CreateConciliationFileDto) => {
  const { data } = await axios.post('conciliation-files', conciliationFile);
  return data as ConciliationFile;
};

// Función para actualizar un archivo de conciliación
export const updateConciliationFile = async (id: number, conciliationFile: UpdateConciliationFileDto) => {
  const { data } = await axios.put(`conciliation-files/${id}`, conciliationFile);
  return data as ConciliationFile;
};

// Función para obtener archivos por conciliación
export const getConciliationFilesByConciliation = async (conciliationId: number) => {
  const { data } = await axios.get(`conciliation-files/conciliation/${conciliationId}`);
  return data as ConciliationFile[];
};

// Función para obtener archivos por tipo
export const getConciliationFilesByType = async (type: number) => {
  const { data } = await axios.get(`conciliation-files/type/${type}`);
  return data as ConciliationFile[];
};

// Función para eliminar un archivo de conciliación
export const deleteConciliationFile = async (id: number) => {
  await axios.delete(`conciliation-files/${id}`);
};
