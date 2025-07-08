import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para marcar controladores o métodos como de solo lectura
 * Cuando se aplica a un controlador, todas las operaciones de escritura
 * (POST, PUT, PATCH, DELETE) serán bloqueadas
 */
export const ReadOnly = () => SetMetadata('readOnly', true);
