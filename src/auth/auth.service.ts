import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        password: true,
        email: true,
        fullname: true,
        roles: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credenciales no válidas');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no válidas');

    const payload = { id: user.id };
    const { password: _, ...rest } = user;

    return {
      ...rest,
      token: this.jwtService.sign(payload),
    };
  }
}
