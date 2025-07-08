import { ApiProperty } from '@nestjs/swagger';

export class BotExecutionCreateDto {
  @ApiProperty()
  botId: number;

  @ApiProperty({ required: false })
  executedAt?: Date;

  @ApiProperty()
  totalProcessedRecords: number;

  @ApiProperty()
  totalDetectedIncidents: number;
}
