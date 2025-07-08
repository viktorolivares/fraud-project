import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  IsInt,
  IsDate,
  MaxLength,
  Matches,
} from 'class-validator';

export class UserCreateDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  lastName: string;

  @ApiProperty({ description: 'Email del usuario', example: 'juan.perez@ejemplo.com' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @MaxLength(100, { message: 'El email no puede tener más de 100 caracteres' })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario (mínimo 6 caracteres)', example: 'password123' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
  password: string;

  @ApiProperty({ description: 'Nombre de usuario único', example: 'jperez' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MaxLength(50, { message: 'El nombre de usuario no puede tener más de 50 caracteres' })
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos' })
  username: string;

  @ApiProperty({ required: false, description: 'ID del canal asociado', example: 1 })
  @IsOptional()
  @IsInt({ message: 'El ID del canal debe ser un número entero' })
  channelId?: number;

  @ApiProperty({ description: 'ID del rol asignado', example: 1 })
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  roleId: number;

  @ApiProperty({ required: false, description: 'Modo oscuro activado', example: false })
  @IsOptional()
  @IsBoolean({ message: 'El modo oscuro debe ser verdadero o falso' })
  darkMode?: boolean;

  @ApiProperty({ required: false, description: 'Usuario activo', example: true })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
  isActive?: boolean;

  @ApiProperty({ required: false, description: 'URL de la imagen de perfil', example: 'https://ejemplo.com/avatar.jpg' })
  @IsOptional()
  @IsString({ message: 'La imagen de perfil debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La URL de la imagen no puede tener más de 255 caracteres' })
  profileImage?: string;

  @ApiProperty({ required: false, description: 'Indica si la contraseña debe ser cambiada', example: false })
  @IsOptional()
  @IsBoolean({ message: 'La bandera de contraseña debe ser verdadero o falso' })
  flagPassword?: boolean;

  @ApiProperty({ required: false, description: 'Fecha de expiración de la contraseña', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDate({ message: 'La fecha de expiración debe ser una fecha válida' })
  expirationPassword?: Date;
}
