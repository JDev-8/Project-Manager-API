import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'member' })
  role: string;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
  user: User;
}
