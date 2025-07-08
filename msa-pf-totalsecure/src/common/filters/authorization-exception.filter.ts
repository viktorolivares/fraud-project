import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * Filtro para manejo específico de errores de autorización y permisos
 * Proporciona información detallada sobre permisos faltantes
 */
@Catch(ForbiddenException, UnauthorizedException)
export class AuthorizationExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException | UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.FORBIDDEN;
    let message = exception.message;
    let error = 'Forbidden';
    let details: Record<string, unknown> = {};

    if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      error = 'Unauthorized';
      message = 'Token de autenticación requerido o inválido';
      details = {
        action: 'login_required',
        description: 'Debes iniciar sesión para acceder a este recurso',
        code: 'AUTH_REQUIRED'
      };
    } else if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      error = 'Insufficient Permissions';
      message = 'No tienes los permisos necesarios para realizar esta acción';
      details = {
        action: 'permission_denied',
        description: 'Tu rol actual no incluye los permisos necesarios',
        code: 'INSUFFICIENT_PERMISSIONS',
        resource: {
          method: request.method,
          path: request.url,
          action: this.getActionFromMethod(request.method),
          resource_type: this.getResourceType(request.url)
        },
        suggestion: 'Contacta al administrador para solicitar los permisos necesarios'
      };
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  /**
   * Determina la acción basada en el método HTTP
   */
  private getActionFromMethod(method: string): string {
    switch (method) {
      case 'GET': return 'read';
      case 'POST': return 'create';
      case 'PUT':
      case 'PATCH': return 'update';
      case 'DELETE': return 'delete';
      default: return 'access';
    }
  }

  /**
   * Determina el tipo de recurso basado en la ruta
   */
  private getResourceType(path: string): string {
    const segments = path.split('/').filter(segment => segment && !segment.includes(':'));
    const resourceSegment = segments.find(segment => segment !== 'api');
    return resourceSegment || 'unknown';
  }
}
