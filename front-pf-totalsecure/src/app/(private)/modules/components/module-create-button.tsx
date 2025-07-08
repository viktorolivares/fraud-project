"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModuleFormModal } from "./module-form-modal";
import { createModule } from "@/api/module.api";
import type { Module } from "@/types/module";
import { Plus } from "lucide-react";

interface ModuleCreateButtonProps {
  onModuleCreated?: () => void;
}

export const ModuleCreateButton: React.FC<ModuleCreateButtonProps> = ({ onModuleCreated }) => {
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: Partial<Module>) => {
    await createModule(data as Module);
    setOpen(false);
    onModuleCreated?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Crear módulo
      </Button>
      <ModuleFormModal open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </>
  );
};
