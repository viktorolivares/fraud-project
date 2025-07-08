/**
 * Definición de módulos de permisos para el sistema TotalSecure
 * Cada módulo agrupa permisos relacionados por funcionalidad
 */

export enum PermissionModule {
  FRAUD_INVESTIGATION = 'fraud-investigation',
  BOT_AUTOMATION = 'bot-automation', 
  SYSTEM_ADMINISTRATION = 'system-administration',
  REPORTING_ANALYTICS = 'reporting-analytics'
}

export enum PermissionAction {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  ASSIGN = 'assign',
  EXECUTE = 'execute',
  CONFIGURE = 'configure',
  MONITOR = 'monitor',
  ANALYZE = 'analyze',
  EXPORT = 'export',
  SCHEDULE = 'schedule',
  CLOSE = 'close'
}

export enum PermissionResource {
  // Recursos de Investigación de Fraude
  CASES = 'cases',
  INCIDENTS = 'incidents', 
  NOTES = 'notes',
  STATES = 'states',
  ASSIGNMENTS = 'assignments',
  
  // Recursos de Automatización por Bots
  BOTS = 'bots',
  EXECUTIONS = 'executions',
  
  // Recursos de Administración del Sistema
  USERS = 'users',
  ROLES = 'roles',
  CHANNELS = 'channels',
  MODULES = 'modules',
  PERMISSIONS = 'permissions',
  
  // Recursos de Reportes y Análisis
  DASHBOARDS = 'dashboards',
  REPORTS = 'reports'
}

/**
 * Clase utilitaria para construir nombres de permisos
 */
export class PermissionBuilder {
  /**
   * Construye un nombre de permiso completo
   * @param module - Módulo del permiso
   * @param resource - Recurso del permiso
   * @param action - Acción del permiso
   * @returns Nombre completo del permiso (ej: 'fraud-investigation.cases.view')
   */
  static build(module: PermissionModule, resource: PermissionResource, action: PermissionAction): string {
    return `${module}.${resource}.${action}`;
  }

  /**
   * Construye múltiples permisos para un recurso
   * @param module - Módulo del permiso
   * @param resource - Recurso del permiso
   * @param actions - Array de acciones
   * @returns Array de nombres de permisos
   */
  static buildMultiple(module: PermissionModule, resource: PermissionResource, actions: PermissionAction[]): string[] {
    return actions.map(action => this.build(module, resource, action));
  }
}

/**
 * Definición de permisos predefinidos por módulo
 */
export const PREDEFINED_PERMISSIONS = {
  // Módulo de Investigación de Fraude
  FRAUD_INVESTIGATION: {
    CASES: PermissionBuilder.buildMultiple(
      PermissionModule.FRAUD_INVESTIGATION, 
      PermissionResource.CASES, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.ASSIGN, PermissionAction.CLOSE]
    ),
    INCIDENTS: PermissionBuilder.buildMultiple(
      PermissionModule.FRAUD_INVESTIGATION, 
      PermissionResource.INCIDENTS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.ASSIGN]
    ),
    NOTES: PermissionBuilder.buildMultiple(
      PermissionModule.FRAUD_INVESTIGATION, 
      PermissionResource.NOTES, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE]
    ),
    STATES: PermissionBuilder.buildMultiple(
      PermissionModule.FRAUD_INVESTIGATION, 
      PermissionResource.STATES, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE]
    ),
    ASSIGNMENTS: PermissionBuilder.buildMultiple(
      PermissionModule.FRAUD_INVESTIGATION, 
      PermissionResource.ASSIGNMENTS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE]
    )
  },

  // Módulo de Automatización por Bots
  BOT_AUTOMATION: {
    BOTS: PermissionBuilder.buildMultiple(
      PermissionModule.BOT_AUTOMATION, 
      PermissionResource.BOTS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.EXECUTE, PermissionAction.CONFIGURE]
    ),
    EXECUTIONS: PermissionBuilder.buildMultiple(
      PermissionModule.BOT_AUTOMATION, 
      PermissionResource.EXECUTIONS, 
      [PermissionAction.VIEW, PermissionAction.MONITOR, PermissionAction.ANALYZE]
    )
  },

  // Módulo de Administración del Sistema
  SYSTEM_ADMINISTRATION: {
    USERS: PermissionBuilder.buildMultiple(
      PermissionModule.SYSTEM_ADMINISTRATION, 
      PermissionResource.USERS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.ASSIGN]
    ),
    ROLES: PermissionBuilder.buildMultiple(
      PermissionModule.SYSTEM_ADMINISTRATION, 
      PermissionResource.ROLES, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.ASSIGN]
    ),
    CHANNELS: PermissionBuilder.buildMultiple(
      PermissionModule.SYSTEM_ADMINISTRATION, 
      PermissionResource.CHANNELS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE]
    ),
    MODULES: PermissionBuilder.buildMultiple(
      PermissionModule.SYSTEM_ADMINISTRATION, 
      PermissionResource.MODULES, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE]
    ),
    PERMISSIONS: PermissionBuilder.buildMultiple(
      PermissionModule.SYSTEM_ADMINISTRATION, 
      PermissionResource.PERMISSIONS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.ASSIGN]
    )
  },

  // Módulo de Reportes y Análisis
  REPORTING_ANALYTICS: {
    DASHBOARDS: PermissionBuilder.buildMultiple(
      PermissionModule.REPORTING_ANALYTICS, 
      PermissionResource.DASHBOARDS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.EXPORT]
    ),
    REPORTS: PermissionBuilder.buildMultiple(
      PermissionModule.REPORTING_ANALYTICS, 
      PermissionResource.REPORTS, 
      [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.EXPORT, PermissionAction.SCHEDULE]
    )
  }
} as const;

/**
 * Lista plana de todos los permisos disponibles
 */
export const ALL_PERMISSIONS = [
  ...PREDEFINED_PERMISSIONS.FRAUD_INVESTIGATION.CASES,
  ...PREDEFINED_PERMISSIONS.FRAUD_INVESTIGATION.INCIDENTS,
  ...PREDEFINED_PERMISSIONS.FRAUD_INVESTIGATION.NOTES,
  ...PREDEFINED_PERMISSIONS.FRAUD_INVESTIGATION.STATES,
  ...PREDEFINED_PERMISSIONS.FRAUD_INVESTIGATION.ASSIGNMENTS,
  ...PREDEFINED_PERMISSIONS.BOT_AUTOMATION.BOTS,
  ...PREDEFINED_PERMISSIONS.BOT_AUTOMATION.EXECUTIONS,
  ...PREDEFINED_PERMISSIONS.SYSTEM_ADMINISTRATION.USERS,
  ...PREDEFINED_PERMISSIONS.SYSTEM_ADMINISTRATION.ROLES,
  ...PREDEFINED_PERMISSIONS.SYSTEM_ADMINISTRATION.CHANNELS,
  ...PREDEFINED_PERMISSIONS.SYSTEM_ADMINISTRATION.MODULES,
  ...PREDEFINED_PERMISSIONS.SYSTEM_ADMINISTRATION.PERMISSIONS,
  ...PREDEFINED_PERMISSIONS.REPORTING_ANALYTICS.DASHBOARDS,
  ...PREDEFINED_PERMISSIONS.REPORTING_ANALYTICS.REPORTS
];

/**
 * Permisos especiales para tablas de solo lectura
 */
export const READ_ONLY_PERMISSIONS = [
  PermissionBuilder.build(PermissionModule.BOT_AUTOMATION, PermissionResource.EXECUTIONS, PermissionAction.VIEW),
  PermissionBuilder.build(PermissionModule.BOT_AUTOMATION, PermissionResource.EXECUTIONS, PermissionAction.MONITOR),
  PermissionBuilder.build(PermissionModule.BOT_AUTOMATION, PermissionResource.EXECUTIONS, PermissionAction.ANALYZE),
  PermissionBuilder.build(PermissionModule.FRAUD_INVESTIGATION, PermissionResource.INCIDENTS, PermissionAction.VIEW),
  PermissionBuilder.build(PermissionModule.FRAUD_INVESTIGATION, PermissionResource.CASES, PermissionAction.VIEW)
];
