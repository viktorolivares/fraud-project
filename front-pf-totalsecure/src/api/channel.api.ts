import axios from "@/lib/api";
import { type Channel, type ChannelCreateDto, type ChannelUpdateDto } from '../types/channel';

// Función para crear un canal
export const createChannel = async (channelData: ChannelCreateDto): Promise<Channel> => {
  const { data } = await axios.post('channels', channelData);
  return data as Channel;
};

// Función para obtener todos los canales
export const getAllChannels = async (): Promise<Channel[]> => {
  const { data } = await axios.get('channels');
  return data as Channel[];
};

// Función para obtener un canal por ID
export const getChannelById = async (id: number): Promise<Channel> => {
  const { data } = await axios.get(`channels/${id}`);
  return data as Channel;
};

// Función para actualizar un canal
export const updateChannel = async (id: number, channelData: ChannelUpdateDto): Promise<Channel> => {
  const { data } = await axios.patch(`channels/${id}`, channelData);
  return data as Channel;
};

// Función para eliminar un canal (soft delete)
export const deleteChannel = async (id: number): Promise<Channel> => {
  const { data } = await axios.delete(`channels/${id}`);
  return data as Channel;
};

// Función para restaurar un canal eliminado
export const restoreChannel = async (id: number): Promise<Channel> => {
  const { data } = await axios.patch(`channels/restore/${id}`);
  return data as Channel;
};
