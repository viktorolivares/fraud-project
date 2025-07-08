import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from '@modules/user/domain/user.entity';
import { Case } from '@modules/case/domain/case.entity';

@Entity('case_assignments')
export class CaseAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'case_id' })
  caseId: number;

  @Column({ name: 'analyst_id' })
  analystId: number;

  @Column({ name: 'assigned_at', type: 'timestamp' })
  assignedAt: Date;

  @Column({ name: 'assigned_by' })
  assignedBy: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relaciones
  @ManyToOne(() => Case, 'assignments')
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @ManyToOne(() => User, 'analystAssignments')
  @JoinColumn({ name: 'analyst_id' })
  analyst: User;

  @ManyToOne(() => User, 'assignedByAssignments')
  @JoinColumn({ name: 'assigned_by' })
  assignedByUser: User;
}
