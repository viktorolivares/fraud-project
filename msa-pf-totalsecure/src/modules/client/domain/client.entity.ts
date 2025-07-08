import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { CaseIncident } from '@modules/case-incident/domain/case-incident.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'text' })
  firstName: string;

  @Column({ name: 'last_name', type: 'text' })
  lastName: string;

  @Column({ name: 'email', type: 'text', nullable: true })
  email?: string;

  @Column({ name: 'national_id_type', type: 'text' })
  nationalIdType: string;

  @Column({ name: 'national_id', type: 'text' })
  nationalId: string;

  @Column({ name: 'birthday', type: 'date', nullable: true })
  birthday?: Date;

  @Column({ name: 'calimaco_user', type: 'bigint', nullable: true })
  calimacoUser?: number;

  @Column({ name: 'mvt_id', type: 'bigint', nullable: true })
  mvtId?: number;

  @Column({ name: 'calimaco_status', type: 'text', nullable: true })
  calimacoStatus?: string;

  // Relations
  @OneToMany(() => CaseIncident, 'client')
  incidents: CaseIncident[];
}
