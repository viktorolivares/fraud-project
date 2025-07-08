import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/user/domain/user.entity';
import { Collector } from '@modules/collector/domain/collector.entity';
import { ConciliationFile } from '@modules/conciliation-file/domain/conciliation-file.entity';

@Entity('conciliations')
export class Conciliation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'collector_id' })
  collectorId: number;

  @Column({ name: 'conciliations_type' })
  conciliationType: number;

  @Column({ type: 'text' })
  period: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'amount_collector', type: 'decimal', precision: 10, scale: 2 })
  amountCollector: number;

  @Column({ name: 'difference_amounts', type: 'decimal', precision: 10, scale: 2 })
  differenceAmounts: number;

  @Column({ name: 'conciliations_state', type: 'boolean' })
  conciliationState: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: number;

  // Relations
  @ManyToOne(() => Collector, 'conciliations')
  @JoinColumn({ name: 'collector_id' })
  collector: Collector;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator?: User;

  @OneToMany(() => ConciliationFile, 'conciliation')
  files: ConciliationFile[];
}
