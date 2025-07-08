import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * Interfaz para errores de PostgreSQL
 */
interface PostgreSQLError {
  code?: string;
  detail?: string;
  constraint?: string;
}

/**
 * Filtro global para manejo de errores de base de datos
 * Convierte errores de TypeORM en respuestas HTTP apropiadas
 */
@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const driverError = exception.driverError as PostgreSQLError;
    const code = driverError?.code || '';
    const detail = driverError?.detail || '';
    const constraint = driverError?.constraint || '';
    
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Error en la base de datos';
    let error = 'Database Error';

    // Errores específicos de PostgreSQL
    switch (code) {
      case '23505': // unique_violation
        status = HttpStatus.CONFLICT;
        message = this.getUniqueConstraintMessage(constraint, detail);
        error = 'Conflict';
        break;
        
      case '23503': // foreign_key_violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Referencia inválida: el recurso relacionado no existe';
        error = 'Foreign Key Violation';
        break;
        
      case '23502': // not_null_violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Campo requerido faltante';
        error = 'Required Field Missing';
        break;
        
      case '23514': // check_violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Valor no válido para el campo';
        error = 'Invalid Value';
        break;
        
      case '22001': // string_data_right_truncation
        status = HttpStatus.BAD_REQUEST;
        message = 'El valor es demasiado largo para el campo';
        error = 'Value Too Long';
        break;
        
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Error interno del servidor';
        error = 'Internal Server Error';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Genera mensajes específicos para errores de restricción única
   */
  private getUniqueConstraintMessage(constraint: string, detail: string): string {
    if (constraint.includes('email') || detail.includes('email')) {
      return 'El email ya está registrado en el sistema';
    }
    
    if (constraint.includes('username') || detail.includes('username')) {
      return 'El nombre de usuario ya está en uso';
    }
    
    if (constraint.includes('unique')) {
      return 'Ya existe un registro con estos datos';
    }
    
    return 'El valor ya existe en el sistema';
  }
}
