import { ApiProperty } from '@nestjs/swagger';

export class RolePermissionResponseDto {
  @ApiProperty({ description: 'ID del permiso', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre del permiso', example: 'view.role' })
  name: string;

  @ApiProperty({ description: 'Descripción del permiso', example: 'Permite ver roles' })
  description?: string;

  @ApiProperty({ description: 'ID del módulo al que pertenece', example: 1 })
  moduleId: number;
}
