// src/auth/auth.controller.ts
import {
    Controller,
    Post,
    Body,
    Res,
    Req,
    Get,
    UnauthorizedException,
    UseGuards,
  } from '@nestjs/common';
  import { Response, Request } from 'express';

  import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorators';

  
  @Controller('auth')
  export class AuthController {
    constructor(private auth: AuthService, private jwt: JwtService) {}
  
    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
      const user = await this.auth.validateUser(dto.email, dto.password);
      const { accessToken, refreshToken } = await this.auth.generateTokens(user);
  
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });
  
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      return { user };
    }
  
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const refresh = req.cookies['refresh_token'];
      if (!refresh) throw new UnauthorizedException();
  
      try {
        const payload = this.jwt.verify(refresh, { secret: process.env.JWT_SECRET });
        const newAccessToken = this.jwt.sign(
          { sub: payload.sub, role: payload.role },
          { expiresIn: '15m' },
        );
  
        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        });
  
        return { accessToken: newAccessToken };
      } catch {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return { message: 'Logged out' };
    }
  
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@GetCurrentUser() user: any) {
      return user;
    }
  }
  