import { SetMetadata } from '@nestjs/common';

/**
 * Clave de metadata para los permisos requeridos
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorador para especificar los permisos requeridos para acceder a un endpoint
 * @param permissions - Array de permisos requeridos
 * @returns Decorador de metadata
 * 
 * @example
 * ```typescript
 * @Permissions('fraud-investigation.cases.view')
 * @Get()
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Decorador para especificar que un endpoint requiere cualquiera de los permisos especificados
 * @param permissions - Array de permisos, cualquiera de los cuales es suficiente
 * @returns Decorador de metadata
 * 
 * @example
 * ```typescript
 * @RequireAnyPermission('fraud-investigation.cases.view', 'fraud-investigation.cases.create')
 * @Get()
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export const RequireAnyPermission = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, { any: permissions });

/**
 * Decorador para especificar que un endpoint requiere todos los permisos especificados
 * @param permissions - Array de permisos, todos son requeridos
 * @returns Decorador de metadata
 * 
 * @example
 * ```typescript
 * @RequireAllPermissions('fraud-investigation.cases.view', 'fraud-investigation.cases.update')
 * @Patch(':id')
 * update(@Param('id') id: string, @Body() data: any) {
 *   return this.service.update(id, data);
 * }
 * ```
 */
export const RequireAllPermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, { all: permissions });
