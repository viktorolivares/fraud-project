import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/domain/user.entity';
import { CaseIncident } from '../../case-incident/domain/case-incident.entity';

@Entity('channels')
export class Channel {
  
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @OneToMany(() => User, (user) => user.channel)
  users: User[];

  @OneToMany(() => CaseIncident, (incident) => incident.channel)
  incidents: CaseIncident[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
