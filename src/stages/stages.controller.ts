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
import { StagesService } from './stages.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('stages')
@UseGuards(AuthGuard())
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  create(@Body() createStageDto: CreateStageDto, @Req() req: any) {
    return this.stagesService.create(createStageDto, req.user);
  }

  @Get('project/:projectId')
  findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Req() req: any,
  ) {
    return this.stagesService.findAllByProject(projectId, req.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStageDto: UpdateStageDto,
    @Req() req: any,
  ) {
    return this.stagesService.update(id, updateStageDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.stagesService.remove(id, req.user);
  }
}
