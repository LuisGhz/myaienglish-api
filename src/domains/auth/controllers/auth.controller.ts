import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../services';
import type { JwtPayload } from '../../../common/interfaces';
import { RegisterReqDto, LoginReqDto } from '../dtos';
import { Public, CurrentUser } from '../../../common/decorators';
import { EnvService } from '../../../config';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private envService: EnvService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterReqDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginReqDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'] || null;
    const ip = req.ip || null;

    const { loginRes, refreshToken } = await this.authService.login(
      dto,
      userAgent,
      ip,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return loginRes;
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!token) {
      this.clearRefreshTokenCookie(res);
      throw new Error('Refresh token not found');
    }

    const userAgent = req.headers['user-agent'] || null;
    const ip = req.ip || null;

    const { loginRes, refreshToken } = await this.authService.refresh(
      token,
      userAgent,
      ip,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return loginRes;
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (token) {
      await this.authService.logout(token);
    }

    this.clearRefreshTokenCookie(res);

    return { message: 'Logged out successfully' };
  }

  @Get('sessions')
  async getSessions(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    const currentToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    return this.authService.getSessions(user.sub, currentToken);
  }

  @Delete('sessions/:id')
  async revokeSession(
    @CurrentUser() user: JwtPayload,
    @Param('id') sessionId: string,
  ) {
    return this.authService.revokeSession(user.sub, sessionId);
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    const isProduction = this.envService.nodeEnv === 'production';

    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(REFRESH_TOKEN_COOKIE);
  }
}
