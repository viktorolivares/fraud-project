import { ApiProperty } from '@nestjs/swagger';

export class CaseIncidentAssignmentCreateDto {
  @ApiProperty()
  caseId: number;

  @ApiProperty()
  incidentId: number;

  @ApiProperty({ required: false })
  assignedAt?: Date;

  @ApiProperty()
  assignedBy: number;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty({ required: false })
  active?: boolean;
}
