import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Stage } from './entities/stage.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StagesService {
  constructor(
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createStageDto: CreateStageDto, user: User) {
    const { projectId, name } = createStageDto;

    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: user.id } },
    });

    if (!project)
      throw new NotFoundException(
        'Proyecto no encontrado o no tienes permisos',
      );

    const stage = this.stageRepository.create({
      name,
      project,
    });

    return this.stageRepository.save(stage);
  }

  async findAllByProject(projectId: string, user: User) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: user.id } },
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');

    return this.stageRepository.find({
      where: { project: { id: projectId } },
      order: { order: 'ASC' },
    });
  }

  private async findOneBySecure(id: string, user: User) {
    const stage = await this.stageRepository.findOne({
      where: { id },
      relations: ['project', 'project.user'],
    });

    if (!stage) throw new NotFoundException('Columna no encontrada');
    if (stage.project.user.id !== user.id)
      throw new UnauthorizedException('Sin permisos');

    return stage;
  }

  async update(id: string, updateStageDto: UpdateStageDto, user: User) {
    const stage = await this.findOneBySecure(id, user);
    this.stageRepository.merge(stage, updateStageDto);
    return this.stageRepository.save(stage);
  }

  async remove(id: string, user: User) {
    const stage = await this.findOneBySecure(id, user);
    return this.stageRepository.remove(stage);
  }
}
