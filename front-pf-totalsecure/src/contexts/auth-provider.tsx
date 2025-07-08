"use client";

// Este componente AuthProvider maneja la autenticación del usuario y el estado del tema (oscuro/claro).
import React, { useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";

// Importa el contexto de autenticación y las funciones de la API
import type { AuthContextProps, LoggedUser, Permission } from "../types/auth";
import { AuthContext } from "./auth-context";
import { updateUser } from "../api/user.api";
import * as authApi from "../api/auth.api";

// Consolidar permisos únicos a partir de los roles del usuario
const consolidatePermissions = (roles: LoggedUser["roles"]) => {
  if (!roles) return [];
  const map = new Map<number, Permission>();
  roles.forEach((role) => {
    role.permissions?.forEach((perm) => {
      if (!map.has(perm.id)) map.set(perm.id, perm);
    });
  });

  console.log("Permisos consolidados:", Array.from(map.values()));
  return Array.from(map.values());
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<LoggedUser | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Actualiza el estado de autenticación y el tema según el usuario
  const setAuthState = React.useCallback(
    (user: LoggedUser | null) => {
      if (user) {
        const permissions = consolidatePermissions(user.roles);
        setCurrentUser({ ...user, permissions });
        setIsAuthenticated(true);
        setPermissions(permissions);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setPermissions([]);
      }
    },
    []
  );

  // Al montar, verifica si hay token y usuario autenticado
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const init = async () => {
      try {
        const res = await authApi.verifyToken();

        console.log("Verificando token:", res);
        setAuthState(res.user || null);
        if (pathname === "/" || pathname === "/login") {
          router.replace("/dashboard");
        }
      } catch (err) {
        setAuthState(null);
        sessionStorage.removeItem("token");
        console.log("Error verificando token:", err);
        router.replace("/login");
      }
    };
    init();
  }, [setAuthState, setTheme, router, pathname]);

  // Función para iniciar sesión
  const loginUser: AuthContextProps["loginUser"] = async (email, password) => {
    try {
      const { token, user } = await authApi.login({ email, password });

      console.log("Usuario autenticado:", user);
      sessionStorage.setItem("token", token);
      setTheme(user.darkMode ? "dark" : "light");
      setAuthState(user);
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  // Función para cerrar sesión
  const logoutUser: AuthContextProps["logoutUser"] = async () => {
    setAuthState(null);
    sessionStorage.removeItem("token");
    router.replace("/login");
  };

  // Cambia el modo oscuro/claro y lo actualiza en el usuario
  const updateDarkMode: AuthContextProps["updateDarkMode"] = async (
    darkMode
  ) => {
    if (!currentUser) {
      return;
    }
    try {
      console.log("Cambiando modo oscuro a:", darkMode);
      setTheme(darkMode ? "dark" : "light");
      const updated = await updateUser(currentUser.id, { darkMode });
      setCurrentUser(updated as LoggedUser);
    } catch (err) {
      console.error(err);
    }
  };

  // Alterna entre modo claro y oscuro
  const toggleTheme: AuthContextProps["toggleTheme"] = async () => {
    await updateDarkMode(theme === "light");
  };

  // Verifica si el usuario tiene un permiso específico
  const hasPermission = (permissionName: string) => {
    return permissions.some((perm) => perm.name === permissionName);
  };

  // Verifica si el usuario tiene un rol específico
  const hasRole = (roleName: string) => {
    return currentUser?.roles?.some((role) => role.name === roleName) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loginUser,
        logoutUser,
        updateDarkMode,
        toggleTheme,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
