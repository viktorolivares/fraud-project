import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

/**
 * Pipe de validación personalizado que formatea los errores de validación
 * para proporcionar mensajes más claros al frontend
 */
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma los datos al tipo esperado
      transformOptions: {
        enableImplicitConversion: true, // Conversión automática de tipos
      },
      exceptionFactory: (validationErrors: ValidationError[]) => {
        return new BadRequestException({
          statusCode: 400,
          message: 'Errores de validación en los datos enviados',
          error: 'Validation Error',
          details: {
            code: 'VALIDATION_FAILED',
            errors: this.formatValidationErrors(validationErrors),
            suggestion: 'Verifica que todos los campos tengan el formato correcto'
          }
        });
      },
    });
  }

  /**
   * Formatea los errores de validación en un formato más amigable
   */
  private formatValidationErrors(errors: ValidationError[]): Array<Record<string, unknown>> {
    return errors.map(error => ({
      field: error.property,
      value: error.value as unknown,
      errors: Object.values(error.constraints || {}),
      children: error.children && error.children.length > 0 
        ? this.formatValidationErrors(error.children) 
        : undefined
    }));
  }
}
