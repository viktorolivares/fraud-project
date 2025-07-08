import { ApiProperty } from '@nestjs/swagger';

export class BotInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  alertType: string;
}

export class BotExecutionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  botId: number;

  @ApiProperty()
  executedAt: Date;

  @ApiProperty()
  totalProcessedRecords: number;

  @ApiProperty()
  totalDetectedIncidents: number;

  @ApiProperty({ type: BotInfoDto, required: false })
  bot?: BotInfoDto;
}
