import axios from "@/lib/api";
import type { Case } from '../types/case';

// Store local para simular asignaciones en modo mock
const mockAssignments: Record<number, any[]> = {};

// Función para agregar una asignación mock
export const addMockAssignment = (caseId: number, assignment: any) => {
  if (!mockAssignments[caseId]) {
    mockAssignments[caseId] = [];
  }
  mockAssignments[caseId].push(assignment);
  console.log("🎭 Mock assignment added:", { caseId, assignment });
};

// Datos mock temporales para casos
const MOCK_CASES: Case[] = [
  {
    id: 1,
    description: "Transacción sospechosa - Tarjeta de crédito",
    captureDate: new Date().toISOString(),
    stateId: 1,
    executionId: 1,
    assignments: [],
  },
  {
    id: 2,
    description: "Patrón anómalo en transferencias",
    captureDate: new Date(Date.now() - 86400000).toISOString(),
    stateId: 1,
    executionId: 2,
    assignments: [],
  },
  {
    id: 3,
    description: "Múltiples retiros en cajeros automáticos",
    captureDate: new Date(Date.now() - 172800000).toISOString(),
    stateId: 2,
    executionId: 1,
    assignments: [],
  },
  {
    id: 4,
    description: "Actividad nocturna inusual",
    captureDate: new Date(Date.now() - 259200000).toISOString(),
    stateId: 1,
    executionId: 3,
    assignments: [],
  },
  {
    id: 5,
    description: "Transacciones internacionales sospechosas",
    captureDate: new Date(Date.now() - 345600000).toISOString(),
    stateId: 3,
    executionId: 2,
    assignments: [],
  },
];

// Función para obtener todos los casos
export const getAllCases = async (fromDate?: string, toDate?: string) => {
  try {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const queryString = params.toString();
    const url = queryString ? `cases?${queryString}` : 'cases';
    
    const { data } = await axios.get(url);
    console.log("🌐 Backend cases received:", data);
    return data as Case[];
  } catch (error) {
    console.warn('🎭 Backend no disponible para casos, usando datos mock:', error);
    let filteredCases = MOCK_CASES;
    
    if (fromDate || toDate) {
      filteredCases = MOCK_CASES.filter(case_ => {
        const caseDate = new Date(case_.captureDate);
        const from = fromDate ? new Date(fromDate) : new Date(0);
        const to = toDate ? new Date(toDate) : new Date();
        return caseDate >= from && caseDate <= to;
      });
    }
    
    // Agregar las asignaciones mock a los casos
    const casesWithAssignments = filteredCases.map(case_ => ({
      ...case_,
      assignments: mockAssignments[case_.id] || []
    }));
    
    console.log("🎭 Mock cases with assignments:", casesWithAssignments);
    return casesWithAssignments;
  }
};

// Función para obtener un caso por ID con información completa
export const getCaseById = async (id: number) => {
  try {
    const { data } = await axios.get(`cases/${id}`);
    return data as Case;
  } catch (error) {
    console.warn('Backend no disponible para caso por ID, usando datos mock:', error);
    const case_ = MOCK_CASES.find(c => c.id === id);
    if (!case_) throw new Error('Caso no encontrado');
    return case_;
  }
};

// Función para obtener un caso con información detallada (incidentes, clientes, canales)
export const getCaseWithDetails = async (id: number) => {
  try {
    console.log(`🔍 Obteniendo caso ${id} con detalles completos de la BD...`);
    const { data } = await axios.get(`cases/${id}/details`);
    console.log(`✅ Caso ${id} cargado exitosamente con datos reales:`, data);
    return data as Case;
  } catch (error) {
    console.error('❌ Error obteniendo caso con detalles de la BD:', error);
    throw error;
  }
};

// Función para obtener casos por ID de ejecución
export const getCasesByExecution = async (executionId: number, fromDate?: string, toDate?: string) => {
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  
  const queryString = params.toString();
  const url = queryString ? `cases/by-execution/${executionId}?${queryString}` : `cases/by-execution/${executionId}`;
  
  const { data } = await axios.get(url);
  return data as Case[];
};

// Función para obtener casos por ID de estado
export const getCasesByState = async (stateId: number, fromDate?: string, toDate?: string) => {
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  
  const queryString = params.toString();
  const url = queryString ? `cases/by-state/${stateId}?${queryString}` : `cases/by-state/${stateId}`;
  
  const { data } = await axios.get(url);
  return data as Case[];
};

// Función para actualizar un caso (resolver/cerrar)
export const updateCase = async (
  id: number,
  changes: Partial<{ stateId: number; closeDate?: string; closeDetail?: string }>
) => {
  try {
    const { data } = await axios.patch(`cases/${id}`, changes);
    return data as Case;
  } catch (error) {
    console.warn('Backend no disponible para actualizar caso, usando mock:', error);
    // Simulación de actualización en MOCK_CASES
    const index = MOCK_CASES.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Caso no encontrado');
    const updated = { ...MOCK_CASES[index], ...changes };
    MOCK_CASES[index] = updated;
    return updated as Case;
  }
};
