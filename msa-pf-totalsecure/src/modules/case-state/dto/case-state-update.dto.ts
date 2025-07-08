import { ApiProperty } from '@nestjs/swagger';

export class CaseStateUpdateDto {
  @ApiProperty({ required: false })
  name?: string;
}
