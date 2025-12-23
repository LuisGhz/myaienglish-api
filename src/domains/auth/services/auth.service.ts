import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/services';
import { RefreshTokenService } from './refresh-token.service';
import {
  RegisterReqDto,
  LoginReqDto,
  LoginResDto,
  SessionResDto,
} from '../dtos';
import type { JwtPayload } from '../../../common/interfaces';

export type { JwtPayload };

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterReqDto): Promise<{ message: string }> {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    await this.userService.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }

  async login(
    dto: LoginReqDto,
    userAgent: string | null,
    ip: string | null,
  ): Promise<{ loginRes: LoginResDto; refreshToken: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const hasReachedLimit =
      await this.refreshTokenService.hasReachedSessionLimit(user.id);
    if (hasReachedLimit)
      throw new BadRequestException(
        'Maximum number of active sessions reached. Please logout from another device.',
      );

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const refreshTokenEntity = await this.refreshTokenService.create(
      user,
      userAgent,
      ip,
    );

    return {
      loginRes: { accessToken },
      refreshToken: refreshTokenEntity.token,
    };
  }

  async refresh(
    token: string,
    userAgent: string | null,
    ip: string | null,
  ): Promise<{ loginRes: LoginResDto; refreshToken: string }> {
    const refreshToken = await this.refreshTokenService.findByToken(token);
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (this.refreshTokenService.isExpired(refreshToken)) {
      await this.refreshTokenService.revoke(refreshToken.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.refreshTokenService.revoke(refreshToken.id);

    const user = refreshToken.user;
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const newRefreshToken = await this.refreshTokenService.create(
      user,
      userAgent,
      ip,
    );

    return {
      loginRes: { accessToken },
      refreshToken: newRefreshToken.token,
    };
  }

  async logout(token: string): Promise<{ message: string }> {
    await this.refreshTokenService.revokeByToken(token);
    return { message: 'Logged out successfully' };
  }

  async getSessions(
    userId: string,
    currentToken: string,
  ): Promise<SessionResDto[]> {
    const sessions = await this.refreshTokenService.findActiveByUserId(userId);

    return sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      expiresDate: session.expiresDate,
      isCurrent: session.token === currentToken,
    }));
  }

  async revokeSession(
    userId: string,
    sessionId: string,
  ): Promise<{ message: string }> {
    const sessions = await this.refreshTokenService.findActiveByUserId(userId);
    const session = sessions.find((s) => s.id === sessionId);

    if (!session) throw new BadRequestException('Session not found');

    await this.refreshTokenService.revoke(sessionId);
    return { message: 'Session revoked successfully' };
  }
}
