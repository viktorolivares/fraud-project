/**
 * 📦 Índice de configuraciones
 * Este archivo exporta todas las configuraciones de la aplicación
 * para facilitar su importación desde otros módulos.
 */

// Configuración de variables de entorno
export * from './env.config';

// Re-exportar tipos importantes
export type { AppConfig, ConfigKey, NodeEnvironment, JwtAlgorithm } from './env.config';
