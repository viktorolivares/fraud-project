import { ApiProperty } from '@nestjs/swagger';

export class BotExecutionUpdateDto {
  @ApiProperty({ required: false })
  botId?: number;

  @ApiProperty({ required: false })
  executedAt?: Date;

  @ApiProperty({ required: false })
  totalProcessedRecords?: number;

  @ApiProperty({ required: false })
  totalDetectedIncidents?: number;
}
