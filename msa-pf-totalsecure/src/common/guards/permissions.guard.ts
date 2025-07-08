import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Request } from 'express';

interface Permission {
  name: string;
}

interface Role {
  permissions: Permission[];
}

interface UserWithRoles {
  roles: Role[];
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.getRequiredPermissions(context);

    if (!requiredPermissions.length) {
      return true; // No se requieren permisos específicos
    }

    const request = context.switchToHttp().getRequest<Request & { user?: UserWithRoles }>();
    const user = request.user;

    console.log('=== DEBUG PERMISSIONS ===');
    console.log('Usuario completo:', JSON.stringify(user, null, 2));
    console.log('Permisos requeridos:', requiredPermissions);

    if (!user) {
      console.log('ERROR: Usuario no autenticado');
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!user.roles || !Array.isArray(user.roles)) {
      console.log('ERROR: Usuario no tiene roles o roles no es array:', user.roles);
      throw new ForbiddenException('Usuario no tiene roles asignados');
    }

    const userPermissions = this.extractUserPermissions(user);
    console.log('Permisos del usuario extraídos:', userPermissions);
    console.log('Permisos requeridos:', requiredPermissions);

    const hasAllPermissions = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    console.log('¿Tiene todos los permisos?', hasAllPermissions);

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(perm => 
        !userPermissions.includes(perm)
      );
      
      console.log('Permisos faltantes:', missingPermissions);
      
      throw new ForbiddenException({
        message: 'No tienes permisos suficientes para realizar esta acción',
        requiredPermissions,
        userPermissions,
        missingPermissions,
        details: `Se requieren los permisos: ${requiredPermissions.join(', ')}`
      });
    }

    console.log('=== END DEBUG PERMISSIONS ===');
    return true;
  }

  private getRequiredPermissions(context: ExecutionContext): string[] {
    return (
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? []
    );
  }

  private extractUserPermissions(user: UserWithRoles): string[] {
    return user.roles?.flatMap((role) =>
      role.permissions?.map((p) => p.name) ?? [],
    ) ?? [];
  }
}
