import { IsEmail, IsString, IsOptional, IsIn } from 'class-validator';

export class InviteUserDto {
  @IsEmail({}, { message: 'Debes ingresar un correo electrónico válido' })
  email: string;

  @IsString()
  @IsOptional()
  @IsIn(['member', 'viewer'], { message: 'El rol debe ser member o viewer' })
  role?: string;
}
