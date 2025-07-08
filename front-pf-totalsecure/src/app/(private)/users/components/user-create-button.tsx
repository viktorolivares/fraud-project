"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserFormModal } from "../components/user-form-modal";
import { createUser, CreateUserDto } from "@/api/user.api";
import type { User } from "@/types/user";
import { Plus } from "lucide-react";

interface UserCreateButtonProps {
  onUserCreated?: () => void;
}

export const UserCreateButton: React.FC<UserCreateButtonProps> = ({ onUserCreated }) => {
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: Partial<User>) => {
    // Validar que password esté presente antes de crear
    if (!data.password) {
      throw new Error('Password is required');
    }
    await createUser(data as CreateUserDto);
    setOpen(false);
    onUserCreated?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} >
        <Plus className="h-4 w-4" />
        Crear usuario
      </Button>
      <UserFormModal open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </>
  );
};
