"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { deleteRole } from "@/api/role.api";
import type { Role } from "@/types/role";
import { ConfirmDialog } from "@/app/(private)/users/components/confirm-dialog";

interface RoleActionsCellProps {
  role: Role;
  onRoleUpdated?: () => void;
  onRoleDeleted?: () => void;
}

export const RoleActionsCell: React.FC<RoleActionsCellProps> = ({
  role,
  onRoleUpdated,
  onRoleDeleted,
}) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/roles/create?id=${role.id}`);
  };

  const handleDelete = async () => {
    await deleteRole(role.id);
    setDeleteOpen(false);
    onRoleDeleted?.();
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
          <DropdownMenuItem onClick={handleEdit}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-600"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="¿Eliminar rol?"
        description={`¿Seguro que deseas eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </>
  );
};
