export interface CaseIncidentAssignment {
  id: number;
  caseId: number;
  incidentId: number;
  assignedAt: string;
  assignedBy: number;
  reason?: string;
  active: boolean;
  // Relations
  case?: {
    id: number;
    description: string;
    captureDate: string;
  };
  incident?: {
    id: number;
    dataJson: Record<string, any>;
  };
  assigner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateCaseIncidentAssignmentDto {
  caseId: number;
  incidentId: number;
  assignedBy: number;
  reason?: string;
  active?: boolean;
}

export interface UpdateCaseIncidentAssignmentDto {
  caseId?: number;
  incidentId?: number;
  assignedBy?: number;
  reason?: string;
  active?: boolean;
}
