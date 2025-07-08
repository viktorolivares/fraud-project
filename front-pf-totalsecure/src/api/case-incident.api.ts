import axios from "@/lib/api";

export interface CaseIncident {
  id: number;
  caseId: number;
  dataJson: Record<string, unknown>;
}

export interface CreateCaseIncidentDto {
  caseId: number;
  dataJson: Record<string, unknown>;
}

export interface UpdateCaseIncidentDto {
  caseId?: number;
  dataJson?: Record<string, unknown>;
}

// Función para crear un incidente de caso
export const createCaseIncident = async (caseIncidentData: CreateCaseIncidentDto) => {
  const { data } = await axios.post('case-incidents', caseIncidentData);
  return data as CaseIncident;
};

// Función para obtener todos los incidentes de casos
export const getAllCaseIncidents = async (fromDate?: string, toDate?: string) => {
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  
  const queryString = params.toString();
  const url = queryString ? `case-incidents?${queryString}` : 'case-incidents';
  
  const { data } = await axios.get(url);
  return data as CaseIncident[];
};

// Función para obtener un incidente de caso por ID
export const getCaseIncidentById = async (id: number) => {
  const { data } = await axios.get(`case-incidents/${id}`);
  return data as CaseIncident;
};

// Función para actualizar un incidente de caso
export const updateCaseIncident = async (id: number, caseIncidentData: UpdateCaseIncidentDto) => {
  const { data } = await axios.put(`case-incidents/${id}`, caseIncidentData);
  return data as CaseIncident;
};

// Función para eliminar un incidente de caso
export const deleteCaseIncident = async (id: number) => {
  await axios.delete(`case-incidents/${id}`);
};

// Función para obtener incidentes por ID de caso
export const getCaseIncidentsByCase = async (caseId: number, fromDate?: string, toDate?: string) => {
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  
  const queryString = params.toString();
  const url = queryString ? `case-incidents/case/${caseId}?${queryString}` : `case-incidents/case/${caseId}`;
  
  const { data } = await axios.get(url);
  return data as CaseIncident[];
};
