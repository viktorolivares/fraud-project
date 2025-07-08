import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class ModuleUpdateDto {
  @ApiProperty({
    description: 'Nombre del módulo',
    example: 'usuarios',
    required: false,
    minLength: 2,
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Descripción del módulo',
    example: 'Gestión de usuarios del sistema',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 255, { message: 'La descripción no puede superar los 255 caracteres' })
  description?: string;
}
