export interface ConciliationFile {
  id: number;
  conciliationId: number;
  conciliationFileType: number; // Updated to match backend
  filePath: string;
  createdAt: string;
  createdBy?: number;
  // Computed properties from backend
  fileName?: string;
  fileExtension?: string;
  fileType?: string;
  // Optional relations
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateConciliationFileDto {
  conciliationId: number;
  conciliationFileType: number; // Updated to match backend
  filePath: string;
  createdBy?: number;
}

export interface UpdateConciliationFileDto {
  conciliationId?: number;
  conciliationFileType?: number; // Updated to match backend
  filePath?: string;
  createdBy?: number;
}
