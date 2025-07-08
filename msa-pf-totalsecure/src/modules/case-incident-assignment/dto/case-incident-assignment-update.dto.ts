import { ApiProperty } from '@nestjs/swagger';

export class CaseIncidentAssignmentUpdateDto {
  @ApiProperty({ required: false })
  caseId?: number;

  @ApiProperty({ required: false })
  incidentId?: number;

  @ApiProperty({ required: false })
  assignedAt?: Date;

  @ApiProperty({ required: false })
  assignedBy?: number;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty({ required: false })
  active?: boolean;
}
