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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get('stage/:stageId')
  findAllByStage(
    @Param('stageId', ParseUUIDPipe) stageId: string,
    @Req() req: any,
  ) {
    return this.tasksService.findAllByStage(stageId, req.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.tasksService.remove(id, req.user);
  }
}
