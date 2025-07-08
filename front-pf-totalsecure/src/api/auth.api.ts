import { LoginCredentials, LoginResponse } from "../types/auth";
import axios from "@/lib/api";

// Función de login
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>("auth/login", credentials);
  return data;
};

// Función de verificación del token
export const verifyToken = async (): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>("auth/verify");
  return data;
};
