import { PartialType } from '@nestjs/swagger';
import { CaseCreateDto } from './case-create.dto';

export class CaseUpdateDto extends PartialType(CaseCreateDto) {}
