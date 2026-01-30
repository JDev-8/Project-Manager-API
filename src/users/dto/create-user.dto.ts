import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  fullname: string;

  @ApiProperty({
    example: 'juan@test.com',
    description: 'Correo único para login',
  })
  @IsString({ message: 'El correo debe ser un texto' })
  @IsEmail(
    {},
    {
      message:
        'El correo electrónico no tiene un formato válido (ejemplo@dominio.com)',
    },
  )
  email: string;

  @ApiProperty({
    example: 'PasswordSeguro123!',
    description: 'Mínimo 6 caracteres',
  })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, {
    message: 'La contraseña es demasiado larga (máx 50 caracteres)',
  })
  password: string;
}
