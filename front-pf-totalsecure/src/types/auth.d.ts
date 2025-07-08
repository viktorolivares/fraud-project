export interface AuthContextProps {
  currentUser: LoggedUser | null;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  updateDarkMode: (darkMode: boolean) => Promise<void>;
  toggleTheme: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: LoggedUser;
}

export interface LoggedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  darkMode: boolean;
  channelId: number;
  roles?: Role[];
  permissions?: Permission[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}