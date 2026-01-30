import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagesService } from './stages.service';
import { StagesController } from './stages.controller';
import { Stage } from './entities/stage.entity';
import { Project } from '../projects/entities/project.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stage, Project]), AuthModule],
  controllers: [StagesController],
  providers: [StagesService],
})
export class StagesModule {}
