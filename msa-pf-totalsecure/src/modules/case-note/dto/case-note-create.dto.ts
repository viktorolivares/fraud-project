import { ApiProperty } from '@nestjs/swagger';

export class CaseNoteCreateDto {
  @ApiProperty()
  caseId: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty({ required: false })
  dateTime?: Date;

  @ApiProperty()
  comment: string;

  @ApiProperty({ required: false })
  attachment?: string;
}
