export interface CaseIncidentData {
  [key: string]: unknown;
}

export interface CaseIncident {
  id: number;
  caseId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataJson: Record<string, any>;  
}

export type CreateCaseIncidentDto = Omit<CaseIncident, 'id'>;
export type UpdateCaseIncidentDto = Partial<CreateCaseIncidentDto>;
