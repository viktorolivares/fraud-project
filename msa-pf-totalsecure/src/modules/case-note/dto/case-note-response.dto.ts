import { ApiProperty } from '@nestjs/swagger';

export class CaseNoteResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  caseId: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  dateTime: Date;

  @ApiProperty()
  comment: string;

  @ApiProperty({ required: false })
  attachment?: string;
}
