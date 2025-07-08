import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BotService } from '../application/bot.service';
import { BotCreateDto } from '../dto/bot-create.dto';
import { BotUpdateDto } from '../dto/bot-update.dto';
import { BotResponseDto } from '../dto/bot-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Bot')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get()
  @Permissions('bot-automation.bots.view')
  @ApiOperation({ summary: 'Get all bots' })
  @ApiResponse({ status: 200, type: [BotResponseDto] })
  findAll() {
    return this.botService.findAll();
  }

  @Get(':id')
  @Permissions('bot-automation.bots.view')
  @ApiOperation({ summary: 'Get a bot by ID' })
  @ApiResponse({ status: 200, type: BotResponseDto })
  findOne(@Param('id') id: string) {
    return this.botService.findOne(Number(id));
  }

  @Post()
  @Permissions('bot-automation.bots.create')
  @ApiOperation({ summary: 'Create a bot' })
  @ApiResponse({ status: 201, type: BotResponseDto })
  create(@Body() data: BotCreateDto) {
    return this.botService.create(data);
  }

  @Patch(':id')
  @Permissions('bot-automation.bots.update')
  @ApiOperation({ summary: 'Update a bot' })
  @ApiResponse({ status: 200, type: BotResponseDto })
  update(@Param('id') id: string, @Body() data: BotUpdateDto) {
    return this.botService.update(Number(id), data);
  }

  @Delete(':id')
  @Permissions('bot-automation.bots.delete')
  @ApiOperation({ summary: 'Delete a bot' })
  @ApiResponse({ status: 200, type: BotResponseDto })
  remove(@Param('id') id: string) {
    return this.botService.remove(Number(id));
  }
}
