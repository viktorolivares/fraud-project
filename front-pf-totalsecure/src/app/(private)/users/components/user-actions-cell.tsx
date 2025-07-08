"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { UserFormModal } from "./user-form-modal";
import { ConfirmDialog } from "./confirm-dialog";
import { updateUser, deleteUser } from "@/api/user.api";
import type { User } from "@/types/user";

interface UserActionsCellProps {
  user: User;
  onUserUpdated?: () => void;
  onUserDeleted?: () => void;
}

export const UserActionsCell: React.FC<UserActionsCellProps> = ({
  user,
  onUserUpdated,
  onUserDeleted,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = async (data: Partial<User>) => {
    await updateUser(user.id, data);
    setEditOpen(false);
    onUserUpdated?.();
  };

  const handleDelete = async () => {
    // Soft delete: actualiza deleted_at e inactiva el usuario en el backend
    await deleteUser(user.id);
    setDeleteOpen(false);
    onUserDeleted?.();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Editar usuario
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            Eliminar usuario
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        initialData={user}
        isEdit
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Eliminar usuario"
        description={`¿Seguro que deseas eliminar a ${user.username}?`}
      />
    </>
  );
};
