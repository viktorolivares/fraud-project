import { ApiProperty } from '@nestjs/swagger';

export class CaseIncidentAssignmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  caseId: number;

  @ApiProperty()
  incidentId: number;

  @ApiProperty()
  assignedAt: Date;

  @ApiProperty()
  assignedBy: number;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty()
  active: boolean;
}
