import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 * Guard para controlar el acceso de solo lectura a tablas específicas
 * Este guard bloquea operaciones de escritura (POST, PUT, PATCH, DELETE) 
 * en tablas marcadas como de solo lectura
 */
@Injectable()
export class ReadOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    
    // Obtener el controlador y el handler
    const controller = context.getClass();
    const handler = context.getHandler();
    
    // Verificar si el controlador está marcado como solo lectura
    const isReadOnly = this.reflector.get<boolean>('readOnly', controller) || 
                       this.reflector.get<boolean>('readOnly', handler);
    
    if (isReadOnly) {
      // Solo permitir operaciones de lectura (GET, HEAD, OPTIONS)
      const allowedMethods = ['GET', 'HEAD', 'OPTIONS'];
      
      if (!allowedMethods.includes(method)) {
        throw new ForbiddenException(
          `La tabla ${controller.name.replace('Controller', '')} es de solo lectura. ` +
          `Operaciones de escritura (${method}) no están permitidas.`
        );
      }
    }
    
    return true;
  }
}
