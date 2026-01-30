import {
  IsString,
  IsUUID,
  MinLength,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Implementar Auth (Corregido)', required: false })
  @IsString()
  @IsOptional()
  @MinLength(1)
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'UUID-NUEVA-COLUMNA',
    description: 'Enviar este ID para MOVER la tarea de columna',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  stageId?: string;

  @ApiProperty({
    example: 2,
    description: 'Nueva posición para reordenar',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}
