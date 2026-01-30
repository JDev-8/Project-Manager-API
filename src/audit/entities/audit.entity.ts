import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  action: string;

  @Column('text')
  entityType: string;

  @Column('text')
  entityId: string;

  @Column('jsonb', { nullable: true })
  details: any;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  user: User;
}
