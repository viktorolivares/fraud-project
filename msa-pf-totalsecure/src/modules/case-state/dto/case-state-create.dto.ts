import { ApiProperty } from '@nestjs/swagger';

export class CaseStateCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
}
