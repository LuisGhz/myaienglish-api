import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instruction } from './entities/instruction.entity';
import { FavTranslation } from './entities/fav-translation.entity';
import { TranslateService } from './services/translate.service';
import { InstructionService } from './services/instruction.service';
import { TranslateController } from './controllers/translate.controller';
import { InstructionController } from './controllers/instruction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Instruction, FavTranslation])],
  controllers: [TranslateController, InstructionController],
  providers: [TranslateService, InstructionService],
  exports: [TranslateService, InstructionService],
})
export class TranslatorModule {}
