"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { Module } from "@/types/module";

interface ModuleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Module>) => void;
  initialData?: Partial<Module>;
  isEdit?: boolean;
}

export const ModuleFormModal: React.FC<ModuleFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData = {},
  isEdit = false,
}) => {
  const [form, setForm] = React.useState<Partial<Module>>(initialData);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setForm(initialData);
      setError(null);
    }
  }, [open]);

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
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Editar Módulo" : "Crear Módulo"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="module-name" className="mb-2 block text-base font-medium">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input
                id="module-name"
                name="name"
                placeholder="Nombre del módulo"
                value={form.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="module-description" className="mb-2 block text-base font-medium">
                Descripción
              </label>
              <Input
                id="module-description"
                name="description"
                placeholder="Descripción breve del módulo"
                value={form.description || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {isEdit ? "Guardar cambios" : "Crear módulo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
