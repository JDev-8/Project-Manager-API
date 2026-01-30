import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Stage } from '../../stages/entities/stage.entity';
import { Task } from '../../tasks/entities/task.entity';
import { ProjectMember } from './project_member.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  user: User;

  @OneToMany(() => Stage, (stage) => stage.project)
  stage: Stage[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];
}
