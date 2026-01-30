import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Stage } from '../../stages/entities/stage.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { default: 0 })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Stage, (stage) => stage.tasks, { onDelete: 'CASCADE' })
  stage: Stage;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => User)
  createdBy: User;
}
