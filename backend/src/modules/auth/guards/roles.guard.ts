
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<Array<'ADMIN'|'USER'>>('roles', ctx.getHandler());
    if (!required?.length) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { id: number; role?: 'ADMIN'|'USER' };
    if (!user?.role || !required.includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
