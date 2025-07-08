export interface CaseState {
  id: number;
  name: string;
}

export type CreateCaseStateDto = Omit<CaseState, 'id'>;
export type UpdateCaseStateDto = Partial<CreateCaseStateDto>;
