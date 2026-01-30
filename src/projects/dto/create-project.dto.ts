import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Mi Nuevo SaaS',
    description: 'Nombre del proyecto (Mínimo 3 letras)',
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, {
    message: 'El nombre del proyecto debe tener al menos 3 letras',
  })
  name: string;

  @ApiProperty({
    example: 'Proyecto para gestionar tareas...',
    description: 'Descripción opcional',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
