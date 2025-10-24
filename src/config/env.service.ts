import { Injectable } from '@nestjs/common';
import type { EnvConfig } from './env.validation';

@Injectable()
export class EnvService {
  private config: EnvConfig;

  constructor(config: EnvConfig) {
    this.config = config;
  }

  get nodeEnv(): string {
    return this.config.NODE_ENV;
  }

  get port(): number {
    return this.config.PORT;
  }

  get openaiApiKey(): string {
    return this.config.OPENAI_API_KEY;
  }
}
