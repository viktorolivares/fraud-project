import axios from "@/lib/api";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  isActive: boolean;
  darkMode: boolean;
  channelId?: number;
  expirationPassword?: string;
  flagPassword: boolean;
  createdAt: string; 
  updatedAt: string;
  deletedAt?: string;
  roleId?: number;
  password?: string;
  role?: string; // Agregado para compatibilidad con case-assignments
}

// Datos mock temporales para usuarios
const MOCK_USERS: User[] = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@totalsecure.com",
    username: "jperez",
    isActive: true,
    darkMode: false,
    flagPassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    roleId: 1,
    role: "Admin",
  },
  {
    id: 2,
    firstName: "María",
    lastName: "García",
    email: "maria.garcia@totalsecure.com",
    username: "mgarcia",
    isActive: true,
    darkMode: false,
    flagPassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    roleId: 2,
    role: "Analista",
  },
  {
    id: 3,
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@totalsecure.com",
    username: "crodriguez",
    isActive: true,
    darkMode: true,
    flagPassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    roleId: 2,
    role: "Analista",
  },
  {
    id: 4,
    firstName: "Ana",
    lastName: "López",
    email: "ana.lopez@totalsecure.com",
    username: "alopez",
    isActive: true,
    darkMode: false,
    flagPassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    roleId: 3,
    role: "Supervisor",
  },
];

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  isActive?: boolean;
  darkMode?: boolean;
  channelId?: number;
  expirationPassword?: string;
  flagPassword?: boolean;
  roleId?: number;
  password: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  profileImage?: string;
  isActive?: boolean;
  darkMode?: boolean;
  channelId?: number;
  expirationPassword?: string;
  flagPassword?: boolean;
  roleId?: number;
  password?: string;
}

// Función para crear un usuario
export const createUser = async (userData: CreateUserDto) => {
  const { data } = await axios.post('users', userData);
  return data as User;
};

// Función para obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const { data } = await axios.get('users');
    return data as User[];
  } catch (error) {
    console.warn('Backend no disponible para usuarios, usando datos mock:', error);
    return MOCK_USERS;
  }
};

// Función para obtener un usuario por ID
export const getUserById = async (id: number) => {
  try {
    const { data } = await axios.get(`users/${id}`);
    return data as User;
  } catch (error) {
    console.warn('Backend no disponible para usuario por ID, usando datos mock:', error);
    const user = MOCK_USERS.find(u => u.id === id);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }
};

// Función para obtener un usuario por correo
export const getUserByEmail = async (email: string) => {
  const { data } = await axios.get(`users/email/${email}`);
  return data as User;
};

// Función para actualizar un usuario
export const updateUser = async (id: number, userData: UpdateUserDto) => {
  const { data } = await axios.patch(`users/${id}`, userData);
  return data as User;
};

// Función para eliminar un usuario
export const deleteUser = async (id: number) => {
  await axios.delete(`users/${id}`);
};
