import { IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStageDto {
  @ApiProperty({
    example: 'To Do',
    description: 'Nombre de la columna (Estado)',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'UUID del proyecto',
  })
  @IsUUID('4', { message: 'El ID del proyecto debe ser válido' })
  projectId: string;
}
