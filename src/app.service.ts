import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instruction } from './entities/instruction.entity';
import { Repository } from 'typeorm';
import { CreateInstructionDto } from './dtos/instructions/create-instruction.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Instruction) private instructionRepository: Repository<Instruction>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  getInstructions() {
    return this.instructionRepository.find();
  }

  async createInstruction({ name, content }: CreateInstructionDto): Promise<Instruction> {
    const instruction = this.instructionRepository.create({ name, content });
    return this.instructionRepository.save(instruction);
  }
}
