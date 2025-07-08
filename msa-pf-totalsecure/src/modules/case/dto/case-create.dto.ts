import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CaseCreateDto {
  @ApiProperty({ description: 'ID de la ejecución del bot' })
  @IsNumber()
  executionId: number;

  @ApiProperty({ description: 'Descripción del caso' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID del estado del caso' })
  @IsNumber()
  stateId: number;

  @ApiProperty({ description: 'ID del usuario afectado', required: false })
  @IsOptional()
  @IsNumber()
  affectedUserId?: number;

  @ApiProperty({ description: 'Fecha de cierre del caso', required: false })
  @IsOptional()
  @IsDateString()
  closeDate?: string;

  @ApiProperty({ description: 'Detalle del cierre del caso', required: false })
  @IsOptional()
  @IsString()
  closeDetail?: string;

  @ApiProperty({ description: 'Evidencia del cierre del caso', required: false })
  @IsOptional()
  @IsString()
  closeEvidence?: string;
}
