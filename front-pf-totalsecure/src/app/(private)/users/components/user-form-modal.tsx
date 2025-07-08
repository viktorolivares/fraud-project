"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Save } from "lucide-react";
import { User } from "@/types/user";
import { useState } from "react";
import { getAllRoles } from '@/api/role.api';
import type { Role } from '@/types/role';
import { Users, Shield } from "lucide-react";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<User>) => void;
  initialData?: Partial<User>;
  isEdit?: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData = {},
  isEdit = false,
}) => {
  const [form, setForm] = React.useState<Partial<User>>(initialData);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);

  React.useEffect(() => {
    if (open) {
      setForm(initialData);
      getAllRoles().then(setRoles);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEdit && form.password !== form.passwordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    const { passwordConfirm, id, createdAt, updatedAt, role, channel, deletedAt, expirationPassword, ...toSend } = form;
    if (typeof toSend.channelId !== 'number' || isNaN(toSend.channelId)) {
      toSend.channelId = undefined;
    }
    onSubmit(toSend);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="3xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName" className="font-medium text-xs">Nombres</label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Nombres"
              value={form.firstName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lastName" className="font-medium text-xs">Apellidos</label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Apellidos"
              value={form.lastName || ""}
              onChange={handleChange}
              required
            />
          </div>
                    <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-medium text-xs">Usuario</label>
            <Input
              id="username"
              name="username"
              placeholder="Usuario"
              value={form.username || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium text-xs">Email</label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-xs">Contraseña</label>
            <InputGroup
              right={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            >
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={form.password || ""}
                onChange={handleChange}
                required={!isEdit}
                autoComplete="new-password"
              />
            </InputGroup>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="passwordConfirm" className="font-medium text-xs">Confirmar contraseña</label>
            <InputGroup
              right={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPasswordConfirm((v) => !v)}
                  className="focus:outline-none"
                >
                  {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            >
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={form.passwordConfirm || ""}
                onChange={handleChange}
                required={!isEdit}
                autoComplete="new-password"
              />
            </InputGroup>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="channelId" className="font-medium text-xs">Canal</label>
            <div className="relative">
              <Users size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-primary" />
              <Select
                value={form.channelId ? String(form.channelId) : ""}
                onValueChange={value => setForm({ ...form, channelId: Number(value) })}
                required
              >
                <SelectTrigger id="channelId" className="w-full pl-8">
                  <SelectValue placeholder="Selecciona un canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Digital</SelectItem>
                  <SelectItem value="2">Teleservicios</SelectItem>
                  <SelectItem value="3">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="roleId" className="font-medium text-xs">Rol</label>
            <div className="relative">
              <Shield size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-primary" />
              <Select
                value={form.roleId ? String(form.roleId) : ''}
                onValueChange={value => setForm({ ...form, roleId: Number(value) })}
                required
              >
                <SelectTrigger id="roleId" className="w-full pl-8">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm col-span-1 md:col-span-2">{error}</div>}
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <DialogFooter>
              <Button type="submit">
                <span className="flex items-center gap-2">
                  <Save size={16} /> {isEdit ? "Guardar Cambios" : "Crear"}
                </span>
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
