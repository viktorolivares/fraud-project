import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean, IsNotEmpty, IsPositive } from 'class-validator';

export class ConciliationCreateDto {
  @ApiProperty({ description: 'ID del colector' })
  @IsNumber()
  @IsPositive()
  collectorId: number;

  @ApiProperty({ description: 'Tipo de conciliación' })
  @IsNumber()
  @IsPositive()
  conciliationType: number;

  @ApiProperty({ description: 'Período de la conciliación' })
  @IsString()
  @IsNotEmpty()
  period: string;

  @ApiProperty({ description: 'Monto' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Monto del colector' })
  @IsNumber()
  @IsPositive()
  amountCollector: number;

  @ApiProperty({ description: 'Diferencia de montos' })
  @IsNumber()
  differenceAmounts: number;

  @ApiProperty({ description: 'Estado de la conciliación' })
  @IsBoolean()
  conciliationState: boolean;
}
