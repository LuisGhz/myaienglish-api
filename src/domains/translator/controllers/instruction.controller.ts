import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InstructionService } from '../services/instruction.service';
import { CreateInstructionDto } from '../dtos/create-instruction.dto';
import { UpdateInstructionDto } from '../dtos/update-instruction.dto';

@Controller('api/instructions')
export class InstructionController {
  constructor(private instructionService: InstructionService) {}

  @Get()
  async getInstructions() {
    return this.instructionService.getInstructions();
  }

  @Post()
  async createInstruction(@Body() createInstructionDto: CreateInstructionDto) {
    return this.instructionService.createInstruction(createInstructionDto);
  }

  @Patch(':id/update')
  async updateInstruction(
    @Param('id') id: string,
    @Body() updateInstructionDto: UpdateInstructionDto,
  ) {
    return this.instructionService.updateInstruction(id, updateInstructionDto);
  }

  @Delete(':id/delete')
  async deleteInstruction(@Param('id') id: string) {
    return this.instructionService.deleteInstruction(id);
  }
}
