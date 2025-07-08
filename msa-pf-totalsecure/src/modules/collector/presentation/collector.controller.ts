import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CollectorService } from '../application/collector.service';
import { CollectorCreateDto } from '../dto/collector-create.dto';
import { CollectorResponseDto } from '../dto/collector-response.dto';

@ApiTags('Collectors')
@Controller('collectors')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo colector' })
  @ApiResponse({ status: 201, description: 'Colector creado exitosamente.', type: CollectorResponseDto })
  async create(@Body() createDto: CollectorCreateDto): Promise<CollectorResponseDto> {
    return this.collectorService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los colectores' })
  @ApiResponse({ status: 200, description: 'Lista de colectores.', type: [CollectorResponseDto] })
  async findAll(): Promise<CollectorResponseDto[]> {
    return this.collectorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un colector por ID' })
  @ApiResponse({ status: 200, description: 'Colector encontrado.', type: CollectorResponseDto })
  @ApiResponse({ status: 404, description: 'Colector no encontrado.' })
  async findOne(@Param('id') id: string): Promise<CollectorResponseDto> {
    return this.collectorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un colector' })
  @ApiResponse({ status: 200, description: 'Colector actualizado exitosamente.', type: CollectorResponseDto })
  @ApiResponse({ status: 404, description: 'Colector no encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CollectorCreateDto>,
  ): Promise<CollectorResponseDto> {
    return this.collectorService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un colector' })
  @ApiResponse({ status: 200, description: 'Colector eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Colector no encontrado.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.collectorService.remove(+id);
  }
}
