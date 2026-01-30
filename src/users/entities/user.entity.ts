import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { ProjectMember } from '../../projects/entities/project_member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullname: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @Column('bool', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => ProjectMember, (membership) => membership.user)
  memberships: ProjectMember[];
}
