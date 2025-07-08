import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';

export class CaseAssignmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  caseId: number;

  @ApiProperty()
  analystId: number;

  @ApiProperty()
  assignedAt: Date;

  @ApiProperty()
  assignedBy: number;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty()
  active: boolean;

  // Relaciones
  @ApiProperty({ type: UserResponseDto, required: false })
  analyst?: UserResponseDto;

  @ApiProperty({ type: UserResponseDto, required: false })
  assigner?: UserResponseDto;
}
