"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { PermissionFormModal } from "./permission-form-modal";
import { ConfirmDialog } from "./confirm-dialog";
import { updatePermission, deletePermission } from "@/api/permission.api";
import type { Permission } from "@/types/permission";

interface PermissionActionsCellProps {
  permission: Permission;
  onPermissionUpdated?: () => void;
  onPermissionDeleted?: () => void;
}

export const PermissionActionsCell: React.FC<PermissionActionsCellProps> = ({ permission, onPermissionUpdated, onPermissionDeleted }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = async (data: Partial<Permission>) => {
    await updatePermission(permission.id, data as Permission);
    setEditOpen(false);
    onPermissionUpdated?.();
  };

  const handleDelete = async () => {
    await deletePermission(permission.id);
    setDeleteOpen(false);
    onPermissionDeleted?.();
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
      <PermissionFormModal open={editOpen} onOpenChange={setEditOpen} onSubmit={handleEdit} initialData={permission} isEdit />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="¿Eliminar permiso?"
        description={`¿Seguro que deseas eliminar el permiso "${permission.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </>
  );
};
