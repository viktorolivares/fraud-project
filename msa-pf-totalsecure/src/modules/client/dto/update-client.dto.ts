import { IsString, IsEmail, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nationalIdType?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsNumber()
  calimacoUser?: number;

  @IsOptional()
  @IsNumber()
  mvtId?: number;

  @IsOptional()
  @IsString()
  calimacoStatus?: string;
}
