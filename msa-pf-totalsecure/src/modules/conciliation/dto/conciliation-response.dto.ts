import { ApiProperty } from '@nestjs/swagger';
import { ConciliationFileResponseDto } from '@modules/conciliation-file/dto/conciliation-file-response.dto';

export class ConciliationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  collectorId: number;

  @ApiProperty()
  conciliationType: number;

  @ApiProperty()
  period: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  amountCollector: number;

  @ApiProperty()
  differenceAmounts: number;

  @ApiProperty()
  conciliationState: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ required: false })
  createdBy?: number;

  @ApiProperty({ required: false })
  collector?: {
    id: number;
    name: string;
  };

  @ApiProperty({ required: false })
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ type: [ConciliationFileResponseDto], required: false })
  files?: ConciliationFileResponseDto[];
}
