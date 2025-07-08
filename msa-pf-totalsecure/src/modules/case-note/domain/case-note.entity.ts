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

@Entity('case_notes')
export class CaseNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'case_id' })
  caseId: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ name: 'date_time', type: 'timestamp' })
  dateTime: Date;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text', nullable: true })
  attachment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne('Case', 'notes')
  @JoinColumn({ name: 'case_id' })
  case: any;

  @ManyToOne(() => User, 'caseNotes')
  @JoinColumn({ name: 'author_id' })
  author: User;
}
