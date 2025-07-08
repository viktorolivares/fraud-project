import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../domain/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client | null> {
    return this.clientRepository.findOne({ where: { id } });
  }

  async findByNationalId(nationalId: string): Promise<Client | null> {
    return this.clientRepository.findOne({ where: { nationalId } });
  }

  async create(clientData: Partial<Client>): Promise<Client> {
    const client = this.clientRepository.create(clientData);
    return this.clientRepository.save(client);
  }

  async update(id: number, clientData: Partial<Client>): Promise<Client | null> {
    await this.clientRepository.update(id, clientData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
