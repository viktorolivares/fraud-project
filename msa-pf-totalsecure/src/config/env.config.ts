import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  User,
  UserRole,
  Role,
  RolePermission,
  Permission,
  Module,
  Channel,
  Bot,
  BotExecution,
  Case,
  CaseState,
  CaseIncident,
  CaseNote,
  CaseAssignment,
  CaseIncidentAssignment,
  Client,
  SystemType,
  Collector,
  Conciliation,
  ConciliationFile,
  Log,
} from '../entities';

/**
 * 🔧 Configuración centralizada de variables de entorno
 * Este archivo maneja todas las variables de entorno de la aplicación
 * de forma tipada y centralizada.
 */

export interface AppConfig {
  // 🌐 Configuración general
  port: number;
  nodeEnv: string;

  // 🔐 Seguridad y JWT
  jwt: {
    secret: string;
    expiresIn: string;
    algorithm: string;
  };

  // 🍪 Cookies
  cookies: {
    maxAge: number;
    domain: string;
    secure: boolean;
  };

  // 🛡️ CORS
  cors: {
    origins: string[];
  };

  // 🛢️ Base de datos
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    sync: boolean;
    logging: boolean;
    ssl: boolean;
    migrationsRun: boolean;
    url?: string; // opcional para casos donde se use una URL completa
  };
}

/**
 * Función para obtener la configuración completa de la aplicación
 * @param configService - Servicio de configuración de NestJS
 * @returns Configuración tipada de la aplicación
 */
export const getAppConfig = (configService: ConfigService): AppConfig => {
  return {
    // 🌐 Configuración general
    port: configService.get<number>('APP_PORT', 3000),
    nodeEnv: configService.get<string>('APP_ENV', 'development'),

    // 🔐 Seguridad y JWT
    jwt: {
      secret: configService.get<string>('JWT_SECRET', 'default-secret-key'),
      expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
      algorithm: configService.get<string>('JWT_ALGORITHM', 'HS256'),
    },

    // 🍪 Cookies
    cookies: {
      maxAge: configService.get<number>('COOKIE_MAX_AGE', 3600000),
      domain: configService.get<string>('COOKIE_DOMAIN', 'localhost'),
      secure: configService.get<boolean>('COOKIE_SECURE', false),
    },

    // 🛡️ CORS
    cors: {
      origins: configService
        .get<string>('CORS_ORIGINS', 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim()),
    },

    // 🛢️ Base de datos
    database: {
      host: configService.get<string>('DATABASE_HOST', 'localhost'),
      port: configService.get<number>('DATABASE_PORT', 5432),
      username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: configService.get<string>('DATABASE_PASSWORD', ''),
      name: configService.get<string>('DATABASE_NAME', 'totalsecure'),
      // sync: configService.get<boolean>('DATABASE_SYNC', false),
      sync: configService.get<string>('DATABASE_SYNC') === 'true',

      logging: configService.get<boolean>('DATABASE_LOGGING', false),
      ssl: configService.get<boolean>('DATABASE_SSL', false),
      migrationsRun: configService.get<boolean>(
        'DATABASE_MIGRATIONS_RUN',
        false,
      ),
      url: configService.get<string>('DATABASE_URL', ''),
    },
  };
};

/**
 * Tipos de algoritmos JWT permitidos
 */
export type JwtAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512';

/**
 * Configuración específica para JWT
 * @param configService - Servicio de configuración de NestJS
 * @returns Configuración JWT
 */
export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET', 'default-secret-key'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
    algorithm: configService.get<string>(
      'JWT_ALGORITHM',
      'HS256',
    ) as JwtAlgorithm,
  },
});

/**
 * Configuración específica para CORS
 * @param configService - Servicio de configuración de NestJS
 * @returns Configuración CORS
 */
export const getCorsConfig = (configService: ConfigService) => ({
  origin: configService
    .get<string>('CORS_ORIGINS', 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
  credentials: true,
});

/**
 * Configuración específica para la base de datos
 * @param configService - Servicio de configuración de NestJS
 * @returns Configuración de base de datos
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const appConfig = getAppConfig(configService);

  const allEntities = [
    User,
    UserRole,
    Role,
    RolePermission,
    Permission,
    Module,
    Channel,
    Bot,
    BotExecution,
    Case,
    CaseState,
    CaseIncident,
    CaseNote,
    CaseAssignment,
    CaseIncidentAssignment,
    Client,
    SystemType,
    Collector,
    Conciliation,
    ConciliationFile,
    Log,
  ];

  return {
    type: 'postgres',
    host: appConfig.database.host,
    port: appConfig.database.port,
    username: appConfig.database.username,
    password: appConfig.database.password,
    database: appConfig.database.name,
    entities: allEntities,
    synchronize: appConfig.database.sync,
  };
};

/**
 * Configuración específica para Swagger
 * @param configService - Servicio de configuración de NestJS
 * @returns Configuración de Swagger
 */
export const getSwaggerConfig = (configService: ConfigService) => {
  const appConfig = getAppConfig(configService);

  return {
    title: 'Total Secure API',
    description: 'Documentación de la API de TotalSecure',
    version: '1.0',
    path: 'api',
    bearerAuth: {
      type: 'http' as const,
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header' as const,
      description: 'Introduce tu token JWT aquí',
    },
    swaggerOptions: {
      persistAuthorization: true,
      url: '/api/v1/api-json',
    },
    isEnabled: appConfig.nodeEnv !== 'production', // Deshabilitar en producción por seguridad
  };
};

/**
 * Constantes de configuración para fácil acceso
 */
export const CONFIG_KEYS = {
  // 🌐 General
  APP_PORT: 'APP_PORT',
  APP_ENV: 'APP_ENV',
  NODE_ENV: 'NODE_ENV',

  // 🔐 JWT
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  JWT_ALGORITHM: 'JWT_ALGORITHM',

  // 🍪 Cookies
  COOKIE_MAX_AGE: 'COOKIE_MAX_AGE',
  COOKIE_DOMAIN: 'COOKIE_DOMAIN',
  COOKIE_SECURE: 'COOKIE_SECURE',

  // 🛡️ CORS
  CORS_ORIGINS: 'CORS_ORIGINS',

  // 🛢️ Database
  DATABASE_HOST: 'DATABASE_HOST',
  DATABASE_PORT: 'DATABASE_PORT',
  DATABASE_USERNAME: 'DATABASE_USERNAME',
  DATABASE_PASSWORD: 'DATABASE_PASSWORD',
  DATABASE_NAME: 'DATABASE_NAME',
  DATABASE_SYNC: 'DATABASE_SYNC',
  DATABASE_LOGGING: 'DATABASE_LOGGING',
  DATABASE_SSL: 'DATABASE_SSL',
  DATABASE_MIGRATIONS_RUN: 'DATABASE_MIGRATIONS_RUN',
  DATABASE_URL: 'DATABASE_URL',
} as const;

/**
 * Tipos para mejor tipado
 */
export type ConfigKey = keyof typeof CONFIG_KEYS;
export type NodeEnvironment = 'development' | 'production' | 'test';

/**
 * Función de validación de configuración
 * @param configService - Servicio de configuración de NestJS
 * @throws Error si alguna configuración requerida no está presente
 */
export const validateConfig = (configService: ConfigService): void => {
  const requiredKeys = [
    CONFIG_KEYS.JWT_SECRET,
    CONFIG_KEYS.DATABASE_HOST,
    CONFIG_KEYS.DATABASE_USERNAME,
    CONFIG_KEYS.DATABASE_PASSWORD,
    CONFIG_KEYS.DATABASE_NAME,
  ];

  const missingKeys = requiredKeys.filter((key) => !configService.get(key));

  if (missingKeys.length > 0) {
    throw new Error(
      `🚨 Configuración faltante: ${missingKeys.join(', ')}. ` +
        'Por favor, verifica tu archivo .env',
    );
  }

  // Validaciones adicionales
  const jwtSecret = configService.get<string>(CONFIG_KEYS.JWT_SECRET);
  if (jwtSecret && jwtSecret.length < 32) {
    console.warn(
      '⚠️  JWT_SECRET es muy corto. Se recomienda usar al menos 32 caracteres para mayor seguridad.',
    );
  }

  const nodeEnv = configService.get<string>(CONFIG_KEYS.APP_ENV);
  if (nodeEnv === 'production') {
    const cookieSecure = configService.get<boolean>(CONFIG_KEYS.COOKIE_SECURE);
    if (!cookieSecure) {
      console.warn(
        '⚠️  En producción, se recomienda establecer COOKIE_SECURE=true',
      );
    }

    const databaseSSL = configService.get<boolean>(CONFIG_KEYS.DATABASE_SSL);
    if (!databaseSSL) {
      console.warn(
        '⚠️  En producción, se recomienda establecer DATABASE_SSL=true',
      );
    }
  }

  // Validar puerto de base de datos
  const dbPort = configService.get<number>(CONFIG_KEYS.DATABASE_PORT);
  if (dbPort && (dbPort < 1 || dbPort > 65535)) {
    console.warn('⚠️  DATABASE_PORT debe estar entre 1 y 65535');
  }
};
