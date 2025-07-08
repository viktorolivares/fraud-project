import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'register_at' })
  registerAt: Date;

  @Column({ name: 'table_name', type: 'text' })
  tableName: string;

  @Column({ name: 'old', type: 'jsonb', nullable: true })
  old?: Record<string, any>;

  @Column({ name: 'new', type: 'jsonb', nullable: true })
  new?: Record<string, any>;
}
