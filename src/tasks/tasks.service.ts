import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { Stage } from '../stages/entities/stage.entity';
import { User } from '../users/entities/user.entity';
import { ProjectMember } from '../projects/entities/project_member.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,
    @InjectRepository(ProjectMember)
    private readonly memberRepository: Repository<ProjectMember>,
    private readonly auditService: AuditService,
  ) {}

  private async validateProjectAccess(projectId: string, user: User) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['user'],
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');

    if (project.user.id === user.id) return project;

    const membership = await this.memberRepository.findOne({
      where: { project: { id: projectId }, user: { id: user.id } },
    });

    if (membership) return project;

    throw new UnauthorizedException('No tienes acceso a este proyecto');
  }

  async create(createTaskDto: CreateTaskDto, user: User) {
    const { projectId, stageId, title, description } = createTaskDto;

    const project = await this.validateProjectAccess(projectId, user);

    const stage = await this.stageRepository.findOne({
      where: { id: stageId, project: { id: projectId } },
    });
    if (!stage)
      throw new BadRequestException('La columna no pertenece a este proyecto');

    const task = this.taskRepository.create({
      title,
      description,
      project,
      stage,
      createdBy: user,
    });
    return this.taskRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'project.user', 'stage'],
    });

    if (!task) throw new NotFoundException('Tarea no encontrada');

    await this.validateProjectAccess(task.project.id, user);

    const isMovingStage =
      updateTaskDto.stageId && task.stage?.id !== updateTaskDto.stageId;

    if (isMovingStage) {
      const oldStageName = task.stage?.name || 'Sin asignación';
      const newStage = await this.stageRepository.findOne({
        where: { id: updateTaskDto.stageId, project: { id: task.project.id } },
      });
      if (!newStage) throw new BadRequestException('Columna inválida');

      task.stage = newStage;

      await this.auditService.createLog(user, 'MOVE_TASK', 'Task', task.id, {
        from: oldStageName,
        to: newStage.name,
        taskTitle: task.title,
      });
    }

    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description) task.description = updateTaskDto.description;
    if (updateTaskDto.position !== undefined)
      task.position = updateTaskDto.position;

    return this.taskRepository.save(task);
  }

  async findAllByStage(stageId: string, user: User) {
    const stage = await this.stageRepository.findOne({
      where: { id: stageId },
      relations: ['project'],
    });

    if (!stage) throw new NotFoundException('Columna no encontrada');

    await this.validateProjectAccess(stage.project.id, user);

    return this.taskRepository.find({
      where: { stage: { id: stageId } },
      order: { position: 'ASC' },
    });
  }

  async remove(id: string, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'project.user'],
    });

    if (!task) throw new NotFoundException('Tarea no encontrada');

    await this.validateProjectAccess(task.project.id, user);

    return this.taskRepository.remove(task);
  }

  findOne(id: string) {
    return `Action #${id}`;
  }
}
