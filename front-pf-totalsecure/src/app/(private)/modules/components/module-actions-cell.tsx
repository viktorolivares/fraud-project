"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ModuleFormModal } from "./module-form-modal";
import { ConfirmDialog } from "./confirm-dialog";
import { updateModule, deleteModule } from "@/api/module.api";
import type { Module } from "@/types/module";

interface ModuleActionsCellProps {
  module: Module;
  onModuleUpdated?: () => void;
  onModuleDeleted?: () => void;
}

export const ModuleActionsCell: React.FC<ModuleActionsCellProps> = ({ module, onModuleUpdated, onModuleDeleted }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = async (data: Partial<Module>) => {
    await updateModule(module.id, data as Module);
    setEditOpen(false);
    onModuleUpdated?.();
  };

  const handleDelete = async () => {
    await deleteModule(module.id);
    setDeleteOpen(false);
    onModuleDeleted?.();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600">
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModuleFormModal open={editOpen} onOpenChange={setEditOpen} onSubmit={handleEdit} initialData={module} isEdit />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="¿Eliminar módulo?"
        description={`¿Seguro que deseas eliminar el módulo "${module.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </>
  );
};
