import { ApiProperty } from '@nestjs/swagger';

export class CaseNoteUpdateDto {
  @ApiProperty({ required: false })
  caseId?: number;

  @ApiProperty({ required: false })
  authorId?: number;

  @ApiProperty({ required: false })
  dateTime?: Date;

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty({ required: false })
  attachment?: string;
}
