import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateInstructionDto } from "src/dtos/instructions/create-instruction.dto";
import { UpdateInstructionDto } from "src/dtos/instructions/update-instruction.dto";
import { InstructionService } from "src/services";

@Controller('api/instructions')
export class InstructionController {
  constructor(private instructionService: InstructionService) { }

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