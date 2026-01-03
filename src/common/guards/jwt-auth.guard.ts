import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { IS_PUBLIC_KEY } from '../decorators';
import { REFRESH_TOKEN_COOKIE } from '../../domains/auth/controllers/auth.controller';
import { JwtPayload, RefreshTokenService } from '../../domains';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch (error) {
      const isExpiredError =
        (error instanceof TokenExpiredError) ||
        (error && (error as any).name === 'TokenExpiredError');

      if (!isExpiredError) throw new UnauthorizedException('Invalid access token');

      await this.#updateTokenIfApplicableWithRefreshToken(
        request,
        context.switchToHttp().getResponse(),
        token,
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }

  async #updateTokenIfApplicableWithRefreshToken(
    req: Request,
    res: Response,
    jwtToken: string,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    const refreshTokenService = this.moduleRef.get(RefreshTokenService, { strict: false });
    if (!refreshTokenService) throw new UnauthorizedException('Refresh token service not available');

    const isActive = await refreshTokenService.findByToken(refreshToken);
    if (!isActive) throw new UnauthorizedException('Refresh token is invalid');

    const payload = this.jwtService.decode(jwtToken) as JwtPayload | null;
    if (!payload || !payload.sub) throw new UnauthorizedException('Invalid token payload');

    const newAccessToken = this.jwtService.sign({ sub: payload.sub, email: payload.email });
    res.setHeader('x-new-access-token', newAccessToken);
    res.setHeader('Access-Control-Expose-Headers', 'x-new-access-token');
    req['user'] = payload;
  }
}
