export interface Log {
  id: number;
  registerAt: string;
  tableName: string;
  old?: Record<string, unknown>;
  new?: Record<string, unknown>;
}

export interface CreateLogDto {
  tableName: string;
  old?: Record<string, unknown>;
  new?: Record<string, unknown>;
}

export interface UpdateLogDto {
  tableName?: string;
  old?: Record<string, unknown>;
  new?: Record<string, unknown>;
}
