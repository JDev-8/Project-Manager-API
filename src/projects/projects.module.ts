import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectMember } from './entities/project_member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([ProjectMember]),
    AuthModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
