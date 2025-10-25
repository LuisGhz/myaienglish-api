import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './config/env.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
