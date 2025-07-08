export interface CaseAssignment {
  id: number;
  caseId: number;
  analystId: number;
  assignedAt: string;
  assignedBy: number;
  reason?: string;
  active: boolean;
  // Relations
  case?: {
    id: number;
    description: string;
    captureDate: string;
    state?: {
      id: number;
      name: string;
    };
  };
  analyst?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  assigner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateCaseAssignmentDto {
  caseId: number;
  analystId: number;
  assignedBy: number;
  reason?: string;
  active?: boolean;
}

export interface UpdateCaseAssignmentDto {
  caseId?: number;
  analystId?: number;
  assignedBy?: number;
  reason?: string;
  active?: boolean;
}
