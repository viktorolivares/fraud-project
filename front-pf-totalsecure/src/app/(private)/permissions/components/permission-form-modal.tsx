"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { Permission } from "@/types/permission";
import { getAllModulesPublic } from "@/api/module.api";
import type { Module } from "@/types/module";
import { Label } from "@/components/ui/label";

interface PermissionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Permission>) => void;
  initialData?: Partial<Permission>;
  isEdit?: boolean;
}

export const PermissionFormModal: React.FC<PermissionFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData = {},
  isEdit = false,
}) => {
  const [form, setForm] = React.useState<Partial<Permission>>(initialData);
  const [error, setError] = React.useState<string | null>(null);
  const [modules, setModules] = React.useState<Module[]>([]);

  React.useEffect(() => {
    if (open) {
      setForm(initialData);
      setError(null);
      getAllModulesPublic().then(setModules);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(initialData)]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.moduleId) {
      setError("El módulo es obligatorio");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Editar Permiso" : "Crear Permiso"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="permission-name" className="mb-2">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="permission-name"
                name="name"
                placeholder="Nombre del permiso"
                value={form.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="permission-description" className="mb-2">
                Descripción
              </Label>
              <Input
                id="permission-description"
                name="description"
                placeholder="Descripción breve del permiso"
                value={form.description || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="permission-moduleId" className="mb-2">
                Módulo <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.moduleId?.toString() || ""}
                onValueChange={(value) => setForm({ ...form, moduleId: Number(value) })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((mod) => (
                    <SelectItem key={mod.id} value={mod.id.toString()}>
                      {mod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {isEdit ? "Guardar cambios" : "Crear permiso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
