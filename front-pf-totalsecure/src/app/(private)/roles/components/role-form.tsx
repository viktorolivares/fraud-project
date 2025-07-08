"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft } from "lucide-react";
import { getAvailablePermissions } from "@/api/role.api";
import { getAllModules } from "@/api/module.api";
import { createRole, updateRole, getRoleById } from "@/api/role.api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

import type { Role } from "@/types/role";
import type { Permission } from "@/types/permission";
import type { Module } from "@/types/module";

export type RoleFormDto = {
  name: string;
  description?: string;
  permissions: number[];
};

export const getPermissionIds = (permissions: any[] | undefined) => {
  if (!permissions) return [];
  return permissions.map((p) => p.permission?.id ?? p.id);
};

interface RoleFormProps {
  roleId?: string | null;
  isEdit?: boolean;
}

export default function RoleForm({ roleId, isEdit = false }: RoleFormProps) {
  const router = useRouter();

  const [form, setForm] = React.useState<Partial<Role>>({});
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [selectedPermissions, setSelectedPermissions] = React.useState<number[]>([]);
  const [activeTab, setActiveTab] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar permisos y módulos
        const [permRes, modRes] = await Promise.all([
          getAvailablePermissions(),
          getAllModules(),
        ]);

        console.log("Permisos cargados:", permRes);
        console.log("Módulos cargados:", modRes);

        setPermissions(permRes as Permission[]);
        setModules(modRes as Module[]);

        if (modRes.length > 0) {
          setActiveTab(modRes[0].id.toString());
        }

        // Si es edición, cargar datos del rol
        if (isEdit && roleId) {
          const roleData = (await getRoleById(Number(roleId))) as Role;
          console.log("Datos del rol:", roleData);
          setForm(roleData);
          const initialPermissionIds = getPermissionIds(roleData.permissions);
          console.log("Permisos del rol:", initialPermissionIds);
          setSelectedPermissions(initialPermissionIds);
        }
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isEdit, roleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePermissionToggle = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleModuleToggle = (moduleId: number) => {
    const modulePermissions = permissionsByModule[moduleId] || [];
    const modulePermissionIds = modulePermissions.map((p) => p.id);
    const allSelected = modulePermissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !modulePermissionIds.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...modulePermissionIds]),
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name?.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setLoading(true);

      const validPermissionIds = new Set(permissions.map((p) => p.id));
      const filteredPermissions = selectedPermissions.filter((id) =>
        validPermissionIds.has(id)
      );

      const payload: RoleFormDto = {
        name: form.name.trim(),
        description: form.description?.trim(),
        permissions: filteredPermissions,
      };

      if (isEdit && roleId) {
        await updateRole(Number(roleId), payload);
        toast.success("Rol actualizado exitosamente");
      } else {
        await createRole(payload);
        toast.success("Rol creado exitosamente");
      }

      router.push("/roles");
    } catch (err) {
      setError("Error al guardar el rol");
      toast.error("Error al guardar el rol");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const permissionsByModule = React.useMemo(() => {
    const result = modules.reduce<Record<string, Permission[]>>((acc, mod) => {
      acc[mod.id] = permissions.filter((p) => p.moduleId === mod.id);
      return acc;
    }, {});
    console.log("Permisos por módulo:", result);
    return result;
  }, [modules, permissions]);

  if (loading && permissions.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="text-lg">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-6">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/roles")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEdit ? "Editar Rol" : "Crear Nuevo Rol"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna izquierda - Información del rol */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Rol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="role-name" className="mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    name="name"
                    placeholder="Administrador, Supervisor..."
                    value={form.name || ""}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="role-description" className="mb-2">
                    Descripción
                  </Label>
                  <Input
                    id="role-description"
                    name="description"
                    placeholder="Descripción breve del rol"
                    value={form.description || ""}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                
                {/* Resumen de permisos seleccionados */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Resumen de Permisos
                  </h4>
                  {selectedPermissions.length > 0 ? (
                    <div className="space-y-3">
                      {/* Total de permisos */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Total seleccionados:
                        </span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {selectedPermissions.length}
                        </span>
                      </div>
                      
                      {/* Permisos por módulo */}
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {modules.map((mod) => {
                          const selectedCount = permissionsByModule[mod.id]?.filter(p => selectedPermissions.includes(p.id)).length || 0;
                          const totalCount = permissionsByModule[mod.id]?.length || 0;
                          
                          if (selectedCount === 0) return null;
                          
                          return (
                            <div key={mod.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                {mod.name}:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {selectedCount}/{totalCount}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      No hay permisos seleccionados
                    </p>
                  )}
                </div>
                
                {/* Botones de acción */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="space-y-3">
                    <Button type="submit" disabled={loading} className="w-full">
                      <Save size={16} className="mr-2" />
                      {loading
                        ? "Guardando..."
                        : isEdit
                        ? "Guardar cambios"
                        : "Crear rol"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/roles")}
                      disabled={loading}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Permisos */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Permisos del Rol</CardTitle>
                  {selectedPermissions.length > 0 && (
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {selectedPermissions.length} permiso(s) seleccionado(s)
                    </span>
                  )}
                </div>
              </CardHeader>
          <CardContent>
            {modules.length > 0 && permissions.length > 0 && activeTab && (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="overflow-x-auto mb-2">
                  <TabsList
                    className={`h-auto p-1 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                      modules.length <= 4 ? "grid w-full" : "flex min-w-max"
                    }`}
                    style={
                      modules.length <= 4
                        ? {
                            gridTemplateColumns: `repeat(${modules.length}, 1fr)`,
                          }
                        : {}
                    }
                  >
                    {modules.map((mod) => {
                      const selectedCount =
                        permissionsByModule[mod.id]?.filter((p) =>
                          selectedPermissions.includes(p.id)
                        ).length || 0;
                      const totalCount =
                        permissionsByModule[mod.id]?.length || 0;

                      return (
                        <TabsTrigger
                          key={mod.id}
                          value={mod.id.toString()}
                          className={`flex flex-col items-center justify-center h-auto py-3 px-4 text-sm font-medium 
                                 data-[state=active]:bg-white data-[state=active]:text-blue-600 
                                 data-[state=active]:shadow-sm data-[state=active]:border-blue-200
                                 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400
                                 dark:data-[state=active]:border-blue-600 dark:text-gray-300
                                 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 rounded-md ${
                                   modules.length > 4 ? "min-w-[140px]" : ""
                                 }`}
                        >
                          <span className="capitalize font-semibold whitespace-nowrap">
                            {mod.name}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                selectedCount > 0
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {selectedCount}/{totalCount}
                            </span>
                            {selectedCount > 0 && (
                              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                            )}
                          </div>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>

                {modules.map((mod) => (
                  <TabsContent
                    key={mod.id}
                    value={mod.id.toString()}
                    className="mt-4 space-y-4"
                  >
                    {permissionsByModule[mod.id]?.length > 0 && (
                      <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                              {
                                permissionsByModule[mod.id].filter((p) =>
                                  selectedPermissions.includes(p.id)
                                ).length
                              }
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {
                                permissionsByModule[mod.id].filter((p) =>
                                  selectedPermissions.includes(p.id)
                                ).length
                              }{" "}
                              de {permissionsByModule[mod.id].length} permisos
                              seleccionados
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Módulo: {mod.name}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleModuleToggle(mod.id)}
                          disabled={loading}
                          className="bg-background hover:bg-muted border"
                        >
                          {permissionsByModule[mod.id].every((p) =>
                            selectedPermissions.includes(p.id)
                          )
                            ? "Deseleccionar todos"
                            : "Seleccionar todos"}
                        </Button>
                      </div>
                    )}

                    <div className="border rounded-lg overflow-hidden shadow-sm max-h-96">
                      <div className="overflow-y-auto max-h-96">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 border-b z-10">
                            <tr>
                              <th className="p-3 text-left font-semibold text-xs uppercase tracking-wide">
                                Permiso
                              </th>
                              <th className="p-3 text-left font-semibold text-xs uppercase tracking-wide">
                                Descripción
                              </th>
                              <th className="p-3 text-center font-semibold text-xs uppercase tracking-wide">
                                Activo
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {permissionsByModule[mod.id]?.length > 0 ? (
                              permissionsByModule[mod.id].map((perm, index) => (
                                <tr
                                  key={perm.id}
                                  className={`border-b hover:bg-muted/50 transition-colors ${
                                    index % 2 === 0 
                                      ? "" 
                                      : "bg-muted/25"
                                  } ${
                                    selectedPermissions.includes(perm.id)
                                      ? "bg-accent"
                                      : ""
                                  }`}
                                >
                                  <td className="p-3 font-medium text-sm">
                                    {perm.name}
                                  </td>
                                  <td className="p-3 text-muted-foreground text-sm leading-relaxed">
                                    {perm.description || "-"}
                                  </td>
                                  <td className="p-3 text-center">
                                    <Switch
                                      checked={selectedPermissions.includes(perm.id)}
                                      onCheckedChange={() => handlePermissionToggle(perm.id)}
                                      disabled={loading}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                      <span className="text-muted-foreground text-lg">📋</span>
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">
                                        No hay permisos disponibles
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Este módulo no tiene permisos configurados
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}

            {(modules.length === 0 || permissions.length === 0) && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-lg">Cargando permisos y módulos...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    {error && (
      <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        {error}
      </div>
    )}
  </form>
</div>
  );
}
