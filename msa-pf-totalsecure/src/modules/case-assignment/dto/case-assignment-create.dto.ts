import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CaseAssignmentCreateDto {
  @ApiProperty()
  @IsNumber()
  caseId: number;

  @ApiProperty()
  @IsNumber()
  analystId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  assignedAt?: Date;

  @ApiProperty()
  @IsNumber()
  assignedBy: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
