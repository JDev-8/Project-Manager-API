import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { Stage } from '../stages/entities/stage.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectMember } from '../projects/entities/project_member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project, Stage, ProjectMember]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
