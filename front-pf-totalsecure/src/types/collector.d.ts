export interface Collector {
  id: number;
  name: string;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
}

export interface CreateCollectorDto {
  name: string;
  createdBy?: number;
}

export interface UpdateCollectorDto {
  name?: string;
  updatedBy?: number;
}
