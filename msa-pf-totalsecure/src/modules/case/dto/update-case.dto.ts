import { IsOptional, IsNumber, IsString, IsISO8601 } from 'class-validator';

export class UpdateCaseDto {
  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsISO8601()
  closeDate?: string;

  @IsOptional()
  @IsString()
  closeDetail?: string;
}
