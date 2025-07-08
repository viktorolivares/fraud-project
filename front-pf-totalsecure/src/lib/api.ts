import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: `${apiBaseUrl}`,
  withCredentials: true,
});

// Interceptor para agregar el token JWT automáticamente a cada request
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // TEMPORAL: Para testing - agregar un token mock
      console.warn("No hay token en sessionStorage, usando token mock para testing");
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer mock-token-for-testing`;
    }
  }
  return config;
});

// Interceptor de respuesta para manejar errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado de error
      const { status, data } = error.response;
      
      switch (status) {
        case 500:
          console.error("Error interno del servidor:", data);
          error.message = "Error interno del servidor. Por favor, intenta más tarde.";
          break;
        case 404:
          console.error("Recurso no encontrado:", data);
          error.message = "El recurso solicitado no fue encontrado.";
          break;
        case 401:
          console.error("No autorizado:", data);
          error.message = "No tienes permisos para acceder a este recurso.";
          break;
        case 403:
          console.error("Prohibido:", data);
          error.message = "Acceso prohibido.";
          break;
        default:
          console.error(`Error ${status}:`, data);
          error.message = data?.message || `Error ${status}`;
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("No se recibió respuesta del servidor:", error.request);
      error.message = "No se pudo conectar con el servidor. Verifica tu conexión.";
    } else {
      // Algo pasó al configurar la petición
      console.error("Error al configurar la petición:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
