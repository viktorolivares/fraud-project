import { ApiProperty } from '@nestjs/swagger';

export class CaseIncidentUpdateDto {
  @ApiProperty({ required: false })
  caseId?: number;

  @ApiProperty({ required: false })
  dataJson?: any;

  @ApiProperty({ required: false })
  client_id?: number;
}
