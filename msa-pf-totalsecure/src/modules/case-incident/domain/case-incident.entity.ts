import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Case } from '@modules/case/domain/case.entity';
import { Client } from '@modules/client/domain/client.entity';
import { Channel } from '@modules/channel/domain/channel.entity';

@Entity('case_incident')
export class CaseIncident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'case_id' })
  caseId: number;

  @Column({ name: 'data_json', type: 'json' })
  dataJson: Record<string, any>;

  @Column({ name: 'client_id', nullable: true })
  clientId?: number;

  @Column({ name: 'channel_id', nullable: true })
  channelId?: number;

  // Relaciones
  @ManyToOne(() => Case, 'incidents')
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @ManyToOne(() => Client, 'incidents')
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Channel, 'incidents')
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;
}
