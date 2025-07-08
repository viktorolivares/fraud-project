import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CollectorCreateDto {
  @ApiProperty({ description: 'Nombre del colector' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
