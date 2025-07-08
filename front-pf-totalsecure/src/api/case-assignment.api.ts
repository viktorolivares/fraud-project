import axios from '@/lib/api';
import type { CaseAssignment, CreateCaseAssignmentDto, UpdateCaseAssignmentDto } from '../types/case-assignment';
import { addMockAssignment } from './case.api';

// Datos mock temporales mientras se implementa el backend
const MOCK_ASSIGNMENTS: CaseAssignment[] = [
  {
    id: 1,
    caseId: 1,
    analystId: 2,
    assignedAt: new Date().toISOString(),
    assignedBy: 1,
    reason: "Caso de alta prioridad requiere atención inmediata",
    active: true,
  },
  {
    id: 2,
    caseId: 2,
    analystId: 3,
    assignedAt: new Date(Date.now() - 86400000).toISOString(), // hace 1 día
    assignedBy: 1,
    reason: "Especialización en fraudes de tarjetas de crédito",
    active: true,
  },
  {
    id: 3,
    caseId: 3,
    analystId: 2,
    assignedAt: new Date(Date.now() - 172800000).toISOString(), // hace 2 días
    assignedBy: 1,
    active: false,
  },
];

// Función para obtener todas las asignaciones de casos
export const getAllCaseAssignments = async () => {
  try {
    const { data } = await axios.get('case-assignments');
    return data as CaseAssignment[];
  } catch (error) {
    console.warn('Backend no disponible, usando datos mock:', error);
    return MOCK_ASSIGNMENTS;
  }
};

// Función para obtener una asignación de caso por ID
export const getCaseAssignmentById = async (id: number) => {
  try {
    const { data } = await axios.get(`case-assignments/${id}`);
    return data as CaseAssignment;
  } catch (error) {
    console.warn('Backend no disponible, usando datos mock:', error);
    const assignment = MOCK_ASSIGNMENTS.find(a => a.id === id);
    if (!assignment) throw new Error('Asignación no encontrada');
    return assignment;
  }
};

// Función para crear una nueva asignación de caso
export const createCaseAssignment = async (caseAssignment: CreateCaseAssignmentDto) => {
  try {
    console.log('Enviando asignación al backend:', caseAssignment);
    console.log('URL completa:', axios.defaults.baseURL + '/case-assignments');
    const { data } = await axios.post('case-assignments', caseAssignment);
    console.log('Respuesta del backend:', data);
    return data as CaseAssignment;
  } catch (error) {
    console.error('Error del backend:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('Error response:', axiosError.response?.data);
      console.error('Error status:', axiosError.response?.status);
    }
    console.warn('🎭 Backend no disponible, simulando creación con mock assignment:', error);
    
    // Crear asignación mock con datos del analista
    const newAssignment: CaseAssignment = {
      id: Math.max(...MOCK_ASSIGNMENTS.map(a => a.id)) + 1,
      ...caseAssignment,
      assignedAt: new Date().toISOString(),
      active: caseAssignment.active ?? true,
      // Agregar información mock del analista
      analyst: {
        id: caseAssignment.analystId,
        firstName: "Analista",
        lastName: `Mock ${caseAssignment.analystId}`,
        email: `analyst${caseAssignment.analystId}@company.com`,
      }
    };
    
    MOCK_ASSIGNMENTS.push(newAssignment);
    
    // Agregar al store de casos mock
    addMockAssignment(caseAssignment.caseId, newAssignment);
    
    return newAssignment;
  }
};

// Función para actualizar una asignación de caso
export const updateCaseAssignment = async (id: number, caseAssignment: UpdateCaseAssignmentDto) => {
  try {
    const { data } = await axios.put(`case-assignments/${id}`, caseAssignment);
    return data as CaseAssignment;
  } catch (error) {
    console.warn('Backend no disponible, simulando actualización:', error);
    const index = MOCK_ASSIGNMENTS.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Asignación no encontrada');
    MOCK_ASSIGNMENTS[index] = { ...MOCK_ASSIGNMENTS[index], ...caseAssignment };
    return MOCK_ASSIGNMENTS[index];
  }
};

// Función para obtener asignaciones por analista
export const getCaseAssignmentsByAnalyst = async (analystId: number) => {
  try {
    const { data } = await axios.get(`case-assignments/analyst/${analystId}`);
    return data as CaseAssignment[];
  } catch (error) {
    console.warn('Backend no disponible, usando datos mock:', error);
    return MOCK_ASSIGNMENTS.filter(a => a.analystId === analystId);
  }
};

// Función para obtener asignaciones por caso
export const getCaseAssignmentsByCase = async (caseId: number) => {
  try {
    const { data } = await axios.get(`case-assignments/case/${caseId}`);
    return data as CaseAssignment[];
  } catch (error) {
    console.warn('Backend no disponible, usando datos mock:', error);
    return MOCK_ASSIGNMENTS.filter(a => a.caseId === caseId);
  }
};

// Función para obtener asignaciones activas
export const getActiveCaseAssignments = async () => {
  try {
    const { data } = await axios.get('case-assignments/active');
    return data as CaseAssignment[];
  } catch (error) {
    console.warn('Backend no disponible, usando datos mock:', error);
    return MOCK_ASSIGNMENTS.filter(a => a.active);
  }
};

// Función para desactivar una asignación
export const deactivateCaseAssignment = async (id: number) => {
  try {
    const { data } = await axios.patch(`case-assignments/${id}/deactivate`);
    return data as CaseAssignment;
  } catch (error) {
    console.warn('Backend no disponible, simulando desactivación:', error);
    const index = MOCK_ASSIGNMENTS.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Asignación no encontrada');
    MOCK_ASSIGNMENTS[index].active = false;
    return MOCK_ASSIGNMENTS[index];
  }
};

// Función para eliminar una asignación de caso
export const deleteCaseAssignment = async (id: number) => {
  try {
    await axios.delete(`case-assignments/${id}`);
  } catch (error) {
    console.warn('Backend no disponible, simulando eliminación:', error);
    const index = MOCK_ASSIGNMENTS.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Asignación no encontrada');
    MOCK_ASSIGNMENTS.splice(index, 1);
  }
};

// Función para asignación masiva de casos
export const bulkAssignCases = async (caseIds: number[], analystId: number, reason?: string) => {
  try {
    console.log('🔄 Iniciando asignación masiva:', { caseIds, analystId, reason });
    const { data } = await axios.post('case-assignments/bulk-assign', {
      caseIds,
      analystId,
      reason,
    });
    console.log('✅ Asignación masiva exitosa:', data);
    return data as CaseAssignment[];
  } catch (error) {
    console.warn('Backend no disponible, simulando asignación masiva:', error);
    
    // Simulación con datos mock
    const newAssignments: CaseAssignment[] = [];
    caseIds.forEach((caseId) => {
      // Verificar si ya existe asignación activa
      const existingAssignment = MOCK_ASSIGNMENTS.find(a => a.caseId === caseId && a.active);
      if (!existingAssignment) {
        const newAssignment: CaseAssignment = {
          id: Math.max(...MOCK_ASSIGNMENTS.map(a => a.id), 0) + newAssignments.length + 1,
          caseId,
          analystId,
          assignedAt: new Date().toISOString(),
          assignedBy: 1,
          reason: reason || undefined,
          active: true,
        };
        MOCK_ASSIGNMENTS.push(newAssignment);
        newAssignments.push(newAssignment);
        
        // Actualizar el caso mock también
        addMockAssignment(caseId, newAssignment);
      }
    });
    
    console.log('✅ Asignación masiva mock completada:', newAssignments);
    return newAssignments;
  }
};
