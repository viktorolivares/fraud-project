import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CaseAssignmentUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  caseId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  analystId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  assignedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  assignedBy?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
