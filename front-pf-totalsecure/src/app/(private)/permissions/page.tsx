"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Plus, 
  Key,
  Database,
  Users,
  Settings
} from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { PermissionCreateButton } from "./components/permission-create-button";
import * as permissionApi from "@/api/permission.api";
import * as moduleApi from "@/api/module.api";
import type { Permission } from "@/types/permission";
import type { Module } from "@/types/module";

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const [permissionsData, modulesData] = await Promise.all([
        permissionApi.getAllPermissions(),
        moduleApi.getAllModules()
      ]);
      setPermissions(permissionsData);
      setModules(modulesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getModulePermissionCount = () => {
    const moduleCount: { [key: number]: number } = {};
    permissions.forEach(permission => {
      moduleCount[permission.moduleId] = (moduleCount[permission.moduleId] || 0) + 1;
    });
    return moduleCount;
  };

  const getModuleName = (moduleId: number) => {
    const moduleItem = modules.find(m => m.id === moduleId);
    return moduleItem ? moduleItem.name : `Módulo ${moduleId}`;
  };

  const modulePermissionCount = getModulePermissionCount();
  const averagePermissionsPerModule = modules.length > 0 ? (permissions.length / modules.length).toFixed(1) : '0';

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Permisos</h1>
          <p className="text-muted-foreground">
            Configuración de permisos y control de acceso del sistema
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permisos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Módulos con Permisos</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(modulePermissionCount).length}
            </div>
            <p className="text-xs text-muted-foreground">de {modules.length} módulos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Módulo</CardTitle>
            <Key className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averagePermissionsPerModule}</div>
            <p className="text-xs text-muted-foreground">permisos por módulo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Control de Acceso</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Activo</div>
            <p className="text-xs text-muted-foreground">Sistema de permisos</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución por Módulo */}
      {Object.keys(modulePermissionCount).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Distribución de Permisos por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(modulePermissionCount).map(([moduleId, count]) => (
                <div
                  key={moduleId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="font-medium">{getModuleName(Number(moduleId))}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Permisos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Lista de Permisos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : permissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Shield className="h-8 w-8 mb-2" />
              <span>No hay permisos configurados</span>
            </div>
          ) : (
            <DataTable
              columns={columns({ onPermissionUpdated: fetchPermissions, onPermissionDeleted: fetchPermissions })}
              data={permissions}
              headerActions={<PermissionCreateButton onPermissionCreated={fetchPermissions} />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Permissions;
