import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from '@modules/user/domain/user.entity';
import { BotExecution } from '@modules/bot-execution/domain/bot-execution.entity';
import { CaseState } from '@modules/case-state/domain/case-state.entity';
import { CaseIncident } from '@modules/case-incident/domain/case-incident.entity';
import { CaseNote } from '@modules/case-note/domain/case-note.entity';
import { CaseAssignment } from '@modules/case-assignment/domain/case-assignment.entity';

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'execution_id' })
  executionId: number;

  @Column({ name: 'capture_date', type: 'timestamp' })
  captureDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'state_id' })
  stateId: number;

  @Column({ name: 'affected_user_id', nullable: true })
  affectedUserId?: number;

  @Column({ name: 'close_date', type: 'timestamp', nullable: true })
  closeDate?: Date;

  @Column({ name: 'close_detail', type: 'text', nullable: true })
  closeDetail?: string;

  @Column({ name: 'close_evidence', type: 'text', nullable: true })
  closeEvidence?: string;

  // Relaciones
  @ManyToOne(() => BotExecution, (execution) => execution.cases)
  @JoinColumn({ name: 'execution_id' })
  botExecution: BotExecution;

  @ManyToOne(() => CaseState, 'cases')
  @JoinColumn({ name: 'state_id' })
  state: CaseState;

  @ManyToOne(() => User, 'affectedCases', { nullable: true })
  @JoinColumn({ name: 'affected_user_id' })
  affectedUser?: User;

  @OneToMany(() => CaseIncident, 'case')
  incidents: CaseIncident[];

  @OneToMany(() => CaseNote, 'case')
  notes: CaseNote[];

  @OneToMany(() => CaseAssignment, 'case')
  assignments: CaseAssignment[];
}
