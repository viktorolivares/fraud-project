import axios from "@/lib/api";
import { type Role } from '../types/role';
import type { RoleFormDto } from "@/app/(private)/roles/components/role-form";

export const createRole = async (roleData: RoleFormDto) => {
  const { data } = await axios.post('roles', roleData);
  return data;
};

export const getAllRoles = async (): Promise<Role[]> => {
  const { data } = await axios.get('roles');
  return data as Role[];
};

export const getRoleById = async (id: number) => {
  const { data } = await axios.get(`roles/${id}`);
  return data;
};

export const updateRole = async (id: number, roleData: RoleFormDto) => {
  const { data } = await axios.patch(`roles/${id}`, roleData);
  return data;
};

export const deleteRole = async (id: number) => {
  const { data } = await axios.delete(`roles/${id}`);
  return data;
};

export const restoreRole = async (id: number) => {
  const { data } = await axios.patch(`roles/restore/${id}`);
  return data;
};

export const getAvailablePermissions = async () => {
  const { data } = await axios.get('roles/permissions/available');
  return data;
};
