export interface CaseNote {
  id: number;
  caseId: number;
  authorId: number;
  dateTime: string;
  comment: string;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseNoteDto {
  caseId: number;
  authorId: number;
  dateTime: string;
  comment: string;
  attachment?: string;
}

export interface UpdateCaseNoteDto {
  caseId?: number;
  authorId?: number;
  dateTime?: string;
  comment?: string;
  attachment?: string;
}
