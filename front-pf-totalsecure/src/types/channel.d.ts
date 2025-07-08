// src/types/channel.d.ts
export interface Channel {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ChannelCreateDto {
  name: string;
  description?: string;
}

export interface ChannelUpdateDto {
  name?: string;
  description?: string;
}
