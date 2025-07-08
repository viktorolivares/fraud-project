import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Channel } from '../../channel/domain/channel.entity';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'channel_id', nullable: true })
  channelId?: number;

  @ManyToOne(() => Channel, (channel) => channel.users, { nullable: true })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel | null;

  @Column({ name: 'expiration_password', type: 'timestamp', nullable: true })
  expirationPassword?: Date;

  @Column({ name: 'flag_password', default: false })
  flagPassword: boolean;

  @Column({ name: 'dark_mode', default: false })
  darkMode: boolean;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: UserRole[];
}
