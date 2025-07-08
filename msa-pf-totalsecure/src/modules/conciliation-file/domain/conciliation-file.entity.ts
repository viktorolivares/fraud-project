import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/user/domain/user.entity';
import { Conciliation } from '@modules/conciliation/domain/conciliation.entity';

@Entity('conciliation_files')
export class ConciliationFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'conciliation_id' })
  conciliationId: number;

  @Column({ name: 'conciliation_files_type' })
  conciliationFileType: number;

  @Column({ name: 'file_path', type: 'text' })
  filePath: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: number;

  // Relations
  @ManyToOne(() => Conciliation, 'files')
  @JoinColumn({ name: 'conciliation_id' })
  conciliation: Conciliation;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator?: User;

  // Computed properties
  get fileName(): string {
    return this.filePath.split('/').pop() || '';
  }

  get fileExtension(): string {
    return this.fileName.split('.').pop()?.toLowerCase() || '';
  }

  get fileType(): 'pdf' | 'excel' | 'csv' | 'image' | 'other' {
    const ext = this.fileExtension;
    if (ext === 'pdf') return 'pdf';
    if (['xlsx', 'xls'].includes(ext)) return 'excel';
    if (ext === 'csv') return 'csv';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    return 'other';
  }
}
