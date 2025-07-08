export interface BotExecution {
  id: number;
  status: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseState {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  isActive: boolean;
  darkMode: boolean;
  channelId?: number;
  expirationPassword?: Date;
  flagPassword?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  nationalIdType: string;
  nationalId: string;
  birthday?: Date;
  calimacoUser?: number;
  mvtId?: number;
  calimacoStatus?: string;
}

export interface CaseIncident {
  id: number;
  caseId: number;
  dataJson: Record<string, unknown>;
  clientId?: number;
  client?: Client;
  channelId?: number;
  channel?: {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  };
}

export interface CaseNote {
  id: number;
  caseId: number;
  authorId: number;
  dateTime: Date;
  comment: string;
  attachment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseAssignment {
  id: number;
  caseId: number;
  analystId: number;
  assignedAt: Date;
  assignedBy: number;
  reason?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  analyst?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    profileImage?: string;
    isActive: boolean;
    darkMode: boolean;
    channelId?: number;
    expirationPassword?: Date;
    flagPassword?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  };
  assigner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    profileImage?: string;
    isActive: boolean;
    darkMode: boolean;
    channelId?: number;
    expirationPassword?: Date;
    flagPassword?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  };
}

export interface Case {
  id: number;
  executionId: number;
  captureDate: string;
  description: string;
  stateId: number;
  affectedUserId?: number | null;
  closeDate?: string | null;
  closeDetail?: string | null;
  closeEvidence?: string | null;
  
  // Relaciones
  botExecution?: BotExecution;
  state?: CaseState;
  affectedUser?: User;
  incidents?: CaseIncident[];
  notes?: CaseNote[];
  assignments?: CaseAssignment[];
  channels?: {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  }[];
}
