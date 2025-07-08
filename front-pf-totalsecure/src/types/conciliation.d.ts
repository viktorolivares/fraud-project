export interface Conciliation {
  id: number;
  collectorId: number;
  conciliationType: number;
  period: string;
  amount: number;
  amountCollector: number;
  differenceAmounts: number;
  conciliationState: boolean;
  createdAt: string; // This should be string as it comes from API as ISO string
  createdBy?: number;
  // Optional relations
  collector?: {
    id: number;
    name: string;
  };
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  files?: {
    id: number;
    conciliationId: number;
    conciliationFileType: number;
    filePath: string;
    fileName: string;
    fileExtension: string;
    fileType: string;
    createdAt: string;
    createdBy?: number;
    creator?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }[];
}

export interface CreateConciliationDto {
  collectorId: number;
  conciliationType: number;
  period: string;
  amount: number;
  amountCollector: number;
  differenceAmounts: number;
  conciliationState: boolean;
  createdBy?: number;
}

export interface UpdateConciliationDto {
  collectorId?: number;
  conciliationType?: number;
  period?: string;
  amount?: number;
  amountCollector?: number;
  differenceAmounts?: number;
  conciliationState?: boolean;
  createdBy?: number;
}
