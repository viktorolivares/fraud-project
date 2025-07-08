import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class RoleUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, type: [Number], description: 'IDs de permisos a asignar al rol' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  permissions?: number[];
}
