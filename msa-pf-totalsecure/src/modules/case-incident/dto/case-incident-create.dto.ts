import { ApiProperty } from '@nestjs/swagger';

export class CaseIncidentCreateDto {
  @ApiProperty()
  caseId: number;

  @ApiProperty({ required: false })
  dataJson?: any;

  @ApiProperty({ required: false })
  client_id?: number;
}
