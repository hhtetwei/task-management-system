// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto';
import { UserType } from '../user/types';

@Injectable()
export class AuthService {
  constructor(private users: UserService, private jwt: JwtService) { }
  
  async registerUser(dto: RegisterUserDto & { profileImage?: Express.Multer.File }) {
    const existing = await this.users.getUserByEmail(dto.email);
    if (existing) throw new UnauthorizedException('Email already in use');
  
    const user = await this.users.createUser({
      email: dto.email,
      name: dto.name,
      phoneNumber: dto.phoneNumber ?? '',
      password: dto.password,
      profileImage: dto.profileImage ?? null,
      type: UserType.USER,
    });
  
    return user;
  }
  async validateUser(email: string, password: string) {
    const user = await this.users.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async generateTokens(user: any) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
