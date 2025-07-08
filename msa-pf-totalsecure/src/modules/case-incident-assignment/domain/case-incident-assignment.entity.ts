import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from '@modules/user/domain/user.entity';

@Entity('case_incident_assignments')
export class CaseIncidentAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'case_id' })
  caseId: number;

  @Column({ name: 'incident_id' })
  incidentId: number;

  @Column({ name: 'assigned_at', type: 'timestamp' })
  assignedAt: Date;

  @Column({ name: 'assigned_by' })
  assignedBy: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne('Case', 'incidentAssignments')
  @JoinColumn({ name: 'case_id' })
  case: any;

  @ManyToOne('CaseIncident', 'assignments')
  @JoinColumn({ name: 'incident_id' })
  incident: any;

  @ManyToOne(() => User, 'incidentAssignments')
  @JoinColumn({ name: 'assigned_by' })
  assignedByUser: User;
}
