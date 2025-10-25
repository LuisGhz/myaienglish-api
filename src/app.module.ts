import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './config/env.module';
import { DatabaseModule } from './db/database.module';
import { Instruction } from './entities/instruction.entity';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Instruction]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
