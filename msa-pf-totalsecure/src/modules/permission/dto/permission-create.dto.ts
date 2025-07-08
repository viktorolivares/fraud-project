import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MaxLength, IsInt, Matches } from 'class-validator';

export class PermissionCreateDto {
  @ApiProperty({ 
    description: 'Nombre único del permiso', 
    example: 'create.user' 
  })
  @IsNotEmpty({ message: 'El nombre del permiso es requerido' })
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre del permiso no puede tener más de 100 caracteres' })
  @Matches(/^[a-z]+\.[a-z]+$/, { message: 'El nombre debe seguir el formato: accion.recurso (ej: create.user)' })
  name: string;

  @ApiProperty({ 
    required: false, 
    description: 'Descripción del permiso', 
    example: 'Permite crear nuevos usuarios en el sistema' 
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no puede tener más de 255 caracteres' })
  description?: string;

  @ApiProperty({ 
    description: 'ID del módulo al que pertenece el permiso', 
    example: 1 
  })
  @IsInt({ message: 'El ID del módulo debe ser un número entero' })
  moduleId: number;
}
