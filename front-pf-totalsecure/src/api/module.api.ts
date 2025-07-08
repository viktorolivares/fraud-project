import axios from "@/lib/api";
import { type Module } from '../types/module';

export const createModule = async (moduleData: Module) => {
  const { data } = await axios.post('modules', moduleData);
  return data;
};

export const getAllModules = async (): Promise<Module[]> => {
  const { data } = await axios.get('modules');
  return data as Module[];
};

export const getAllModulesPublic = async (): Promise<Module[]> => {
  const { data } = await axios.get('modules/public');
  return data as Module[];
};

export const getModuleById = async (id: number) => {
  const { data } = await axios.get(`modules/${id}`);
  return data;
};

export const updateModule = async (id: number, moduleData: Module) => {
  const { data } = await axios.patch(`modules/${id}`, moduleData);
  return data;
};

export const deleteModule = async (id: number) => {
  const { data } = await axios.delete(`modules/${id}`);
  return data;
};

export const restoreModule = async (id: number) => {
  const { data } = await axios.patch(`modules/restore/${id}`);
  return data;
};
