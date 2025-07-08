import { ApiProperty } from '@nestjs/swagger';
import { ChannelResponseDto } from '@modules/channel/dto/channel-response.dto';

export class BotResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  alertType: string;

  @ApiProperty({ required: false })
  lastRun?: Date;
  
  @ApiProperty({ required: false, description: 'ID of the channel this bot belongs to' })
  channelId?: number;
  
  @ApiProperty({ required: false, type: ChannelResponseDto })
  channel?: ChannelResponseDto;
}
