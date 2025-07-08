"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RoleCreateButtonProps {
  onRoleCreated?: () => void;
}

export const RoleCreateButton: React.FC<RoleCreateButtonProps> = ({ onRoleCreated }) => {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/roles/create");
  };

  return (
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4" />
      Crear rol
    </Button>
  );
};
