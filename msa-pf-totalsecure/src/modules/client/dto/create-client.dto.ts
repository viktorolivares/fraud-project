import { IsString, IsEmail, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateClientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  nationalIdType: string;

  @IsString()
  nationalId: string;

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
