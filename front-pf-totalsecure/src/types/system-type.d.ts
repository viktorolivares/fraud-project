export interface SystemType {
  id: number;
  typeId: number;
  description: string;
  tableName: string;
  columnName: string;
  isActive: boolean;
}

export interface CreateSystemTypeDto {
  typeId: number;
  description: string;
  tableName: string;
  columnName: string;
  isActive: boolean;
}

export interface UpdateSystemTypeDto {
  typeId?: number;
  description?: string;
  tableName?: string;
  columnName?: string;
  isActive?: boolean;
}
