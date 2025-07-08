import { ApiProperty } from '@nestjs/swagger';

export class ConciliationFileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  conciliationId: number;

  @ApiProperty()
  conciliationFileType: number;

  @ApiProperty()
  filePath: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  fileExtension: string;

  @ApiProperty()
  fileType: 'pdf' | 'excel' | 'csv' | 'image' | 'other';

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ required: false })
  createdBy?: number;

  @ApiProperty({ required: false })
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}
