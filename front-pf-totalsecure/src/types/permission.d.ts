// src/types/permission.ts
export interface Permission {
  id: number;
  name: string;
  description?: string;
  moduleId: number;
  createdAt: Date;
  updatedAt: Date;
}
