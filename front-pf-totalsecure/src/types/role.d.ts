// src/types/role.ts
import type { Permission } from "./permission";

export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Permission[];
}
