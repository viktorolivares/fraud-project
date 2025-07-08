import axios from '@/lib/api';
import type { CaseNote, CreateCaseNoteDto, UpdateCaseNoteDto } from '../types/case-note';

// Función para obtener todas las notas de casos
export const getAllCaseNotes = async () => {
  const { data } = await axios.get('case-notes');
  return data as CaseNote[];
};

// Función para obtener una nota de caso por ID
export const getCaseNoteById = async (id: number) => {
  const { data } = await axios.get(`case-notes/${id}`);
  return data as CaseNote;
};

// Función para crear una nueva nota de caso
export const createCaseNote = async (caseNote: CreateCaseNoteDto) => {
  const { data } = await axios.post('case-notes', caseNote);
  return data as CaseNote;
};

// Función para actualizar una nota de caso
export const updateCaseNote = async (id: number, caseNote: UpdateCaseNoteDto) => {
  const { data } = await axios.put(`case-notes/${id}`, caseNote);
  return data as CaseNote;
};

// Función para eliminar una nota de caso
export const deleteCaseNote = async (id: number) => {
  await axios.delete(`case-notes/${id}`);
};
