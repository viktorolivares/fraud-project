import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('system_types')
export class SystemType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type_id' })
  typeId: number;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'table_name', type: 'text' })
  tableName: string;

  @Column({ name: 'column_name', type: 'text' })
  columnName: string;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;
}
