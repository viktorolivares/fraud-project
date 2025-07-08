"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Key, 
  Settings,
  UserCog
} from "lucide-react";
import { RoleCreateButton } from "./components/role-create-button";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import * as roleApi from "@/api/role.api";
import * as userApi from "@/api/user.api";
import type { Role } from "@/types/role";
import type { User } from "@/types/user";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, usersData] = await Promise.all([
        roleApi.getAllRoles(),
        userApi.getAllUsers()
      ]);
      setRoles(rolesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const response = await roleApi.getAllRoles();
    setRoles(response);
  };

  const getUsersCountByRole = (roleName: string) => {
    return users.filter(user => user.role === roleName).length;
  };

  const totalPermissions = roles.reduce((total, role) => {
    return total + (role.permissions?.length || 0);
  }, 0);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Roles</h1>
          <p className="text-muted-foreground">
            Administración de roles y permisos del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {roles.length} rol(es)
          </span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Asignados</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permisos</CardTitle>
            <Key className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPermissions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Permisos</CardTitle>
            <Settings className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {roles.length > 0 ? (totalPermissions / roles.length).toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución de Usuarios por Rol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {role.permissions?.length || 0} permiso(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getUsersCountByRole(role.name)} usuario(s)
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Lista de Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Shield className="h-8 w-8 mb-2" />
              <span>No hay roles registrados</span>
            </div>
          ) : (
            <DataTable
              columns={columns({ onRoleUpdated: fetchRoles, onRoleDeleted: fetchRoles })}
              data={roles}
              headerActions={<RoleCreateButton onRoleCreated={fetchRoles} />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Roles;
