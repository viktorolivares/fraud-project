import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAvailablePermissions } from '@/hooks/use-available-permissions';
import type { Permission } from '@/types/permission';

interface PermissionSelectorProps {
  selectedPermissions: number[];
  onPermissionToggle: (permissionId: number, checked: boolean) => void;
  disabled?: boolean;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  selectedPermissions,
  onPermissionToggle,
  disabled = false,
}) => {
  const { permissions, loading, error } = useAvailablePermissions();

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Permisos</Label>
        <div className="text-sm text-gray-500">Cargando permisos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Permisos</Label>
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label>Seleccionar Permisos</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-md p-3">
        {permissions.map((permission: Permission) => (
          <div key={permission.id} className="flex items-center space-x-2">
            <Checkbox
              id={`permission-${permission.id}`}
              checked={selectedPermissions.includes(permission.id)}
              onCheckedChange={(checked) => 
                onPermissionToggle(permission.id, checked as boolean)
              }
              disabled={disabled}
            />
            <div className="flex-1 min-w-0">
              <Label 
                htmlFor={`permission-${permission.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permission.name}
              </Label>
              {permission.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {permission.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedPermissions.length > 0 && (
        <div className="text-sm text-gray-600">
          {selectedPermissions.length} permiso(s) seleccionado(s)
        </div>
      )}
    </div>
  );
};
