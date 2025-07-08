import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class BotCreateDto {
  @ApiProperty({ description: 'Name of the bot' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'Description of the bot' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Alert type of the bot' })
  @IsNotEmpty()
  @IsString()
  alertType: string;
  
  @ApiProperty({ required: false, description: 'ID of the channel this bot belongs to' })
  @IsOptional()
  @IsInt()
  channelId?: number;
}
