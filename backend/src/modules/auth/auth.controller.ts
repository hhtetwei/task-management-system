
import {
  Controller, Post, Body, Res, Req, Get,
  UnauthorizedException, UseGuards, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorators';
import { Public } from './decorators/public-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../user/user.entity';

const ACCESS_TTL_MS = 60 * 60 * 1000;         
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === 'production';
const sameSite: 'lax' | 'none' | 'strict' = isProd ? 'lax' : 'lax';

function setAuthCookies(res: Response, accessToken: string, refreshToken?: string) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite,
    maxAge: ACCESS_TTL_MS,
    path: '/',
  });

  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite,
      maxAge: REFRESH_TTL_MS,
      path: '/',
    });
  }
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private jwt: JwtService) {}

  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
    @Body() dto: any,
    @UploadedFile() profileImage: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.registerUser({ ...dto, profileImage });
    const { accessToken, refreshToken } = await this.auth.generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Public()
  @Post('login')
  async login(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const { accessToken, refreshToken } = await this.auth.generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh = req.cookies['refresh_token'];
    if (!refresh) throw new UnauthorizedException();

    try {
      const payload = this.jwt.verify(refresh, { secret: process.env.JWT_SECRET });
      const newAccessToken = this.jwt.sign(
        { sub: payload.sub, role: payload.role },
        { expiresIn: '1h' } 
      );

      setAuthCookies(res, newAccessToken);
      return { ok: true };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@GetCurrentUser() user: any) {
    return user;
  }
}
