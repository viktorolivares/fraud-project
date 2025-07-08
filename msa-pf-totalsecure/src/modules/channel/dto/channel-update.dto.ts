import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';

export class ChannelUpdateDto {
  @ApiProperty({
    description: 'Nombre del canal',
    example: 'Tarjeta de Crédito y Débito',
    required: false,
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9\-_.]+$/, { 
    message: 'El nombre solo puede contener letras, números, espacios, guiones y puntos' 
  })
  name?: string;

  @ApiProperty({
    description: 'Descripción del canal',
    example: 'Canal para casos de fraude relacionados con tarjetas de crédito y débito',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;
}
