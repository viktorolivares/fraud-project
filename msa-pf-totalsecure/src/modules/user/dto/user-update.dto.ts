import { PartialType, ApiProperty } from '@nestjs/swagger';
import { UserCreateDto } from './user-create.dto';
import { IsOptional, IsInt } from 'class-validator';

/**
 * DTO para actualizar un usuario
 * Hereda todos los campos de UserCreateDto pero los hace opcionales
 */
export class UserUpdateDto extends PartialType(UserCreateDto) {
  @ApiProperty({ required: false, description: 'ID del nuevo rol a asignar', example: 2 })
  @IsOptional()
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  roleId?: number;
}
