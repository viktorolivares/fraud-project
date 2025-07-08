import axios from '@/lib/api';
import type { Client, CreateClientDto, UpdateClientDto } from '../types/client';

// Función para obtener todos los clientes
export const getAllClients = async () => {
  const { data } = await axios.get('clients');
  return data as Client[];
};

// Función para obtener un cliente por ID
export const getClientById = async (id: number) => {
  const { data } = await axios.get(`clients/${id}`);
  return data as Client;
};

// Función para buscar cliente por número de documento
export const getClientByNationalId = async (nationalId: string) => {
  const { data } = await axios.get(`clients/national-id/${nationalId}`);
  return data as Client;
};

// Función para crear un nuevo cliente
export const createClient = async (client: CreateClientDto) => {
  const { data } = await axios.post('clients', client);
  return data as Client;
};

// Función para actualizar un cliente
export const updateClient = async (id: number, client: UpdateClientDto) => {
  const { data } = await axios.put(`clients/${id}`, client);
  return data as Client;
};

// Función para eliminar un cliente
export const deleteClient = async (id: number) => {
  await axios.delete(`clients/${id}`);
};
