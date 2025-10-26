import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { EnvModule } from './config/env.module';
import { DatabaseModule } from './db/database.module';
import { Instruction } from './entities/instruction.entity';
import { FavTranslation } from './entities/fav-translation.entity';
import { OpenAIService, TranslateService, InstructionService } from './services';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Instruction, FavTranslation]),
  ],
  controllers: [AppController],
  providers: [OpenAIService, TranslateService, InstructionService],
})
export class AppModule { }
