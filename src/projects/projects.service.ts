import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { ProjectMember } from './entities/project_member.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(ProjectMember)
    private readonly memberRepository: Repository<ProjectMember>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      user: user,
    });

    await this.projectRepository.save(project);

    return project;
  }

  async findAll(user: User) {
    return this.projectRepository.find({
      where: [
        { user: { id: user.id } },
        { members: { user: { id: user.id } } },
      ],
    });
  }

  async findOne(id: string, user: User) {
    const project = await this.projectRepository.findOne({
      where: [
        { id, user: { id: user.id } },
        { id, members: { user: { id: user.id } } },
      ],
      relations: ['stages', 'stages.tasks'],
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');

    return project;
  }

  async inviteUser(
    projectId: string,
    inviteUserDto: InviteUserDto,
    currentUser: User,
  ) {
    const { email, role } = inviteUserDto;

    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: currentUser.id } },
    });

    if (!project)
      throw new UnauthorizedException('Solo el dueño puede invitar usuarios');

    const userToInvite = await this.userRepository.findOneBy({ email });
    if (!userToInvite)
      throw new NotFoundException(
        'El usuario con ese email no existe en el sistema',
      );

    if (userToInvite.id === currentUser.id) {
      throw new BadRequestException('No puedes invitarte a ti mismo');
    }

    const existingMember = await this.memberRepository.findOne({
      where: { project: { id: projectId }, user: { id: userToInvite.id } },
    });

    if (existingMember)
      throw new BadRequestException(
        'El usuario ya es miembro de este proyecto',
      );

    const membership = this.memberRepository.create({
      project,
      user: userToInvite,
      role: role || 'member',
    });

    return this.memberRepository.save(membership);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: User) {
    const project = await this.findOne(id, user);
    this.projectRepository.merge(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string, user: User) {
    const project = await this.findOne(id, user);
    return this.projectRepository.remove(project);
  }
}
