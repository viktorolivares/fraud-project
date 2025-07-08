import axios from "@/lib/api";
import type { CaseState, CreateCaseStateDto, UpdateCaseStateDto } from '../types/case-state';

// Función para crear un estado de caso
export const createCaseState = async (caseStateData: CreateCaseStateDto) => {
  const { data } = await axios.post('case-states', caseStateData);
  return data as CaseState;
};

// Función para obtener todos los estados de caso
export const getAllCaseStates = async () => {
  const { data } = await axios.get('case-states');
  return data as CaseState[];
};

// Función para obtener un estado de caso por ID
export const getCaseStateById = async (id: number) => {
  const { data } = await axios.get(`case-states/${id}`);
  return data as CaseState;
};

// Función para actualizar un estado de caso
export const updateCaseState = async (id: number, caseStateData: UpdateCaseStateDto) => {
  const { data } = await axios.put(`case-states/${id}`, caseStateData);
  return data as CaseState;
};

// Función para eliminar un estado de caso
export const deleteCaseState = async (id: number) => {
  const { data } = await axios.delete(`case-states/${id}`);
  return data;
};
