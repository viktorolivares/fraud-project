import axios from '@/lib/api';
import type { CaseIncidentAssignment, CreateCaseIncidentAssignmentDto, UpdateCaseIncidentAssignmentDto } from '../types/case-incident-assignment';

// Función para obtener todas las asignaciones de incidentes de casos
export const getAllCaseIncidentAssignments = async () => {
  const { data } = await axios.get('case-incident-assignments');
  return data as CaseIncidentAssignment[];
};

// Función para obtener una asignación de incidente de caso por ID
export const getCaseIncidentAssignmentById = async (id: number) => {
  const { data } = await axios.get(`case-incident-assignments/${id}`);
  return data as CaseIncidentAssignment;
};

// Función para crear una nueva asignación de incidente de caso
export const createCaseIncidentAssignment = async (caseIncidentAssignment: CreateCaseIncidentAssignmentDto) => {
  const { data } = await axios.post('case-incident-assignments', caseIncidentAssignment);
  return data as CaseIncidentAssignment;
};

// Función para actualizar una asignación de incidente de caso
export const updateCaseIncidentAssignment = async (id: number, caseIncidentAssignment: UpdateCaseIncidentAssignmentDto) => {
  const { data } = await axios.put(`case-incident-assignments/${id}`, caseIncidentAssignment);
  return data as CaseIncidentAssignment;
};

// Función para eliminar una asignación de incidente de caso
export const deleteCaseIncidentAssignment = async (id: number) => {
  await axios.delete(`case-incident-assignments/${id}`);
};
