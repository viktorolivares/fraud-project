import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsNotEmpty } from 'class-validator';

export class BotUpdateDto {
  @ApiProperty({ required: false, description: 'Name of the bot' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false, description: 'Description of the bot' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Alert type of the bot' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  alertType?: string;
  
  @ApiProperty({ required: false, description: 'ID of the channel this bot belongs to' })
  @IsOptional()
  @IsInt()
  channelId?: number;
}
