import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { addDays, addMonths, addHours, addMinutes, addWeeks } from 'date-fns';
import { RefreshToken } from '../entities';
import { User } from '../../user/entities';
import { EnvService } from '../../../config';

@Injectable()
export class RefreshTokenService {
  private readonly MAX_SESSIONS = 3;

  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private envService: EnvService,
  ) {}

  async countActiveSessions(userId: string): Promise<number> {
    return this.refreshTokenRepository.count({
      where: {
        user: { id: userId },
        isRevoked: false,
      },
    });
  }

  async hasReachedSessionLimit(userId: string): Promise<boolean> {
    const count = await this.countActiveSessions(userId);
    return count >= this.MAX_SESSIONS;
  }

  async create(
    user: User,
    userAgent: string | null,
    ip: string | null,
  ): Promise<RefreshToken> {
    const token = this.generateToken();
    const expiresDate = this.calculateExpiration(
      this.envService.refreshTokenExpiresIn,
    );

    const refreshToken = this.refreshTokenRepository.create({
      user,
      token,
      expiresDate,
      userAgent,
      ip,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user'],
    });
  }

  async findActiveByUserId(userId: string): Promise<RefreshToken[]> {
    return this.refreshTokenRepository.find({
      where: {
        user: { id: userId },
        isRevoked: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async revoke(id: string): Promise<void> {
    await this.refreshTokenRepository.update(id, { isRevoked: true });
  }

  async revokeByToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update({ token }, { isRevoked: true });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { user: { id: userId }, isRevoked: false },
      { isRevoked: true },
    );
  }

  isExpired(refreshToken: RefreshToken): boolean {
    return new Date() > refreshToken.expiresDate;
  }

  private generateToken(): string {
    const length = this.envService.refreshTokenLength;
    return randomBytes(length).toString('hex');
  }

  private calculateExpiration(expiresIn: string): Date {
    const match = expiresIn.match(/^(\d+)([mhdwM])$/);
    if (!match) {
      throw new Error(`Invalid expiration format: ${expiresIn}`);
    }

    const amount = parseInt(match[1], 10);
    const type = match[2];
    const now = new Date();

    switch (type) {
      case 'm':
        return addMinutes(now, amount);
      case 'h':
        return addHours(now, amount);
      case 'd':
        return addDays(now, amount);
      case 'w':
        return addWeeks(now, amount);
      case 'M':
        return addMonths(now, amount);
      default:
        throw new Error(`Unknown expiration type: ${type}`);
    }
  }
}
