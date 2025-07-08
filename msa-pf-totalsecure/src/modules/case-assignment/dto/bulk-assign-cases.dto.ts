import { IsArray, IsNumber, IsOptional, IsString, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkAssignCasesDto {
  @ApiProperty({
    description: 'IDs de los casos a asignar',
    type: [Number],
    example: [1, 2, 3, 4],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Se debe proporcionar al menos un ID de caso' })
  @IsNumber({}, { each: true, message: 'Todos los IDs de caso deben ser números' })
  caseIds: number[];

  @ApiProperty({
    description: 'ID del analista al que se asignarán los casos',
    example: 2,
  })
  @IsNumber({}, { message: 'El ID del analista debe ser un número' })
  analystId: number;

  @ApiPropertyOptional({
    description: 'Motivo de la asignación masiva',
    example: 'Asignación por especialización en fraudes de tarjetas de crédito',
  })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  reason?: string;
}
