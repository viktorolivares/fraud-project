import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BotExecution } from '@modules/bot-execution/domain/bot-execution.entity';
import { Channel } from '@modules/channel/domain/channel.entity';

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'alert_type', type: 'text' })
  alertType: string;

  @Column({ name: 'last_run', type: 'timestamp', nullable: true })
  lastRun?: Date;
  
  @Column({ name: 'channel_id', type: 'int', nullable: true })
  channelId?: number;
  
  @ManyToOne(() => Channel, { nullable: true })
  @JoinColumn({ name: 'channel_id' })
  channel?: Channel;

  @OneToMany(() => BotExecution, (exec) => exec.bot)
  executions: BotExecution[];
}
