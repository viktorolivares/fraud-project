import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { updateUser } from "@/api/user.api";
import type { User } from "@/types/user";
import { ConfirmDialog } from "./confirm-dialog";

interface UserActiveCellProps {
  user: User;
  onUserUpdated?: () => void;
}

export const UserActiveCell: React.FC<UserActiveCellProps> = ({ user, onUserUpdated }) => {
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await updateUser(user.id, { isActive: !user.isActive });
      onUserUpdated?.();
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="xs"
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        className="flex gap-1 items-center text-muted-foreground"
      >
        {user.isActive ? (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        ) : (
          <XCircleIcon className="text-red-500 dark:text-red-400" />
        )}
        {user.isActive ? "Activo" : "Inactivo"}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleToggle}
        title={user.isActive ? "Desactivar usuario" : "Activar usuario"}
        description={`¿Seguro que deseas ${user.isActive ? "desactivar" : "activar"} al usuario ${user.username}?`}
        confirmLabel={user.isActive ? "Desactivar" : "Activar"}
        cancelLabel="Cancelar"
      />
    </>
  );
};
