import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany 
} from 'typeorm';

@Entity('case_states')
export class CaseState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  // Relaciones
  @OneToMany('Case', 'state')
  cases: any[];
}
