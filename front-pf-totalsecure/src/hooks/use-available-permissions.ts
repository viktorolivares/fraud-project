import { useState, useEffect } from 'react';
import { getAvailablePermissions } from '@/api/role.api';
import type { Permission } from '@/types/permission';

export const useAvailablePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const data = await getAvailablePermissions();
        setPermissions(data as Permission[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar permisos');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissions, loading, error };
};
