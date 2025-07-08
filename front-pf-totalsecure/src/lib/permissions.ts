import type { Role, Permission } from "../types/auth";

/**
 * Devuelve un array de permisos únicos a partir de los roles proporcionados.
 * @param roles Lista de roles del usuario
 * @returns Permission[]
 */
export function getPermissionsFromRoles(roles?: Role[]): Permission[] {
  if (!roles) return [];
  const map = new Map<number, Permission>();
  roles.forEach(role => {
    role.permissions?.forEach(perm => {
      if (!map.has(perm.id)) map.set(perm.id, perm);
    });
  });
  return Array.from(map.values());
}
