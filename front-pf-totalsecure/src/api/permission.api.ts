import axios from "@/lib/api";
import { type Permission } from '../types/permission';

export const createPermission = async (permissionData: Permission) => {
  const { data } = await axios.post('permissions', permissionData);
  return data;
};

export const getAllPermissions = async (): Promise<Permission[]> => {
  const { data } = await axios.get('permissions');
  return data as Permission[];
};

export const getPermissionById = async (id: number) => {
  const { data } = await axios.get(`permissions/${id}`);
  return data;
};

export const updatePermission = async (id: number, permissionData: Permission) => {
  const { data } = await axios.patch(`permissions/${id}`, permissionData);
  return data;
};

export const deletePermission = async (id: number) => {
  const { data } = await axios.delete(`permissions/${id}`);
  return data;
};

export const restorePermission = async (id: number) => {
  const { data } = await axios.patch(`permissions/restore/${id}`);
  return data;
};
