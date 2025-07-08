import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class RoleCreateDto {
  @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre del rol no puede tener más de 50 caracteres' })
  name: string;

  @ApiProperty({ required: false, description: 'Descripción del rol', example: 'Rol con acceso completo al sistema' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no puede tener más de 255 caracteres' })
  description?: string;

  @ApiProperty({ 
    required: false, 
    type: [Number], 
    description: 'IDs de permisos a asignar al rol',
    example: [1, 2, 3] 
  })
  @IsOptional()
  @IsArray({ message: 'Los permisos deben ser un array de números' })
  @IsInt({ each: true, message: 'Cada permiso debe ser un número entero' })
  permissions?: number[];
}
