import { MinLength, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implementar Auth',
    description: 'Título de la tarea',
  })
  @IsString()
  @MinLength(1, { message: 'El tétulo es obligatorio' })
  title: string;

  @ApiProperty({
    example: 'Configurar Passport y JWT Strategy',
    description: 'Detalle opcional',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'UUID-DEL-PROYECTO', description: 'ID del proyecto' })
  @IsUUID('4', { message: 'El ID del proyecto no es válido' })
  projectId: string;

  @ApiProperty({
    example: 'UUID-DEL-STAGE-TO-DO',
    description: 'ID de la columna inicial',
  })
  @IsUUID('4', { message: 'El ID de la columna no es válido' })
  stageId: string;
}
