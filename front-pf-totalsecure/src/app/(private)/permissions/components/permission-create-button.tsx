"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PermissionFormModal } from "./permission-form-modal";
import { createPermission } from "@/api/permission.api";
import type { Permission } from "@/types/permission";
import { Plus } from "lucide-react";

interface PermissionCreateButtonProps {
  onPermissionCreated?: () => void;
}

export const PermissionCreateButton: React.FC<PermissionCreateButtonProps> = ({ onPermissionCreated }) => {
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: Partial<Permission>) => {
    await createPermission(data as Permission);
    setOpen(false);
    onPermissionCreated?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Crear permiso
      </Button>
      <PermissionFormModal open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </>
  );
};
