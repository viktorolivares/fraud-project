"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Plus, 
  Shield,
  Database,
  Calendar,
  Activity
} from "lucide-react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { ModuleCreateButton } from "./components/module-create-button";
import * as moduleApi from "@/api/module.api";
import * as permissionApi from "@/api/permission.api";
import type { Module } from "@/types/module";
import type { Permission } from "@/types/permission";
import { format } from "date-fns";

const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const [modulesData, permissionsData] = await Promise.all([
        moduleApi.getAllModules(),
        permissionApi.getAllPermissions()
      ]);
      setModules(modulesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getModulePermissionCount = (moduleId: number) => {
    return permissions.filter(p => p.moduleId === moduleId).length;
  };

  const getModulesWithPermissions = () => {
    return modules.filter(module => getModulePermissionCount(module.id) > 0).length;
  };

  const getTotalPermissions = () => {
    return permissions.length;
  };

  const getRecentModules = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return modules.filter(module => new Date(module.createdAt) > oneWeekAgo).length;
  };

  const modulesWithPermissions = getModulesWithPermissions();
  const totalPermissions = getTotalPermissions();
  const recentModules = getRecentModules();

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Módulos</h1>
          <p className="text-muted-foreground">
            Configuración de módulos del sistema y sus permisos asociados
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Módulos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Permisos</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{modulesWithPermissions}</div>
            <p className="text-xs text-muted-foreground">módulos configurados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permisos</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPermissions}</div>
            <p className="text-xs text-muted-foreground">en todos los módulos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Módulos Recientes</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{recentModules}</div>
            <p className="text-xs text-muted-foreground">última semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Módulos con Permisos */}
      {modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Resumen de Permisos por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => {
                const permissionCount = getModulePermissionCount(module.id);
                return (
                  <div
                    key={module.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-medium truncate text-sm mb-1">{module.name}</h3>
                      {module.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 break-words leading-relaxed">
                          {module.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {format(new Date(module.createdAt), "dd/MM/yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-center min-w-[60px]">
                      <Badge variant={permissionCount > 0 ? "default" : "secondary"} className="text-xs">
                        {permissionCount}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">permisos</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Módulos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Package className="h-8 w-8 mb-2" />
              <span>No hay módulos registrados</span>
            </div>
          ) : (
            <DataTable
              columns={columns({ onModuleUpdated: fetchModules, onModuleDeleted: fetchModules })}
              data={modules}
              headerActions={<ModuleCreateButton onModuleCreated={fetchModules} />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Modules;
