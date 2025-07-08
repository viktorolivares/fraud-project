import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Bot } from '@modules/bot/domain/bot.entity';
import { Case } from '@modules/case/domain/case.entity';

@Entity('bot_executions')
export class BotExecution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bot_id' })
  botId: number;

  @Column({ name: 'executed_at' })
  executedAt: Date;

  @Column({ name: 'total_processed_records' })
  totalProcessedRecords: number;

  @Column({ name: 'total_detected_incidents' })
  totalDetectedIncidents: number;

  @ManyToOne(() => Bot, (bot) => bot.executions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bot_id' })
  bot: Bot;

  @OneToMany(() => Case, (caseEntity) => caseEntity.botExecution)
  cases: Case[];
}
