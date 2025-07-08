import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientService } from '../application/client.service';
import { Client } from '../domain/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Client | null> {
    return this.clientService.findOne(parseInt(id));
  }

  @Get('national-id/:nationalId')
  async findByNationalId(@Param('nationalId') nationalId: string): Promise<Client | null> {
    return this.clientService.findByNationalId(nationalId);
  }

  @Post()
  async create(@Body() clientData: CreateClientDto): Promise<Client> {
    const clientEntity: Partial<Client> = {
      ...clientData,
      birthday: clientData.birthday ? new Date(clientData.birthday) : undefined,
    };
    return this.clientService.create(clientEntity);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() clientData: UpdateClientDto): Promise<Client | null> {
    const clientEntity: Partial<Client> = {
      ...clientData,
      birthday: clientData.birthday ? new Date(clientData.birthday) : undefined,
    };
    return this.clientService.update(parseInt(id), clientEntity);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.clientService.delete(parseInt(id));
  }
}
