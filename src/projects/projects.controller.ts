import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { InviteUserDto } from './dto/invite-user.dto';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(createProjectDto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.projectsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.projectsService.findOne(id, req.user);
  }

  @Post(':id/invite')
  inviteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() inviteUserDto: InviteUserDto,
    @Req() req: any,
  ) {
    return this.projectsService.inviteUser(id, inviteUserDto, req.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.projectsService.remove(id, req.user);
  }
}
