import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateInstructionDto } from './dtos/instructions/create-instruction.dto';
import { UpdateInstructionDto } from './dtos/instructions/update-instruction.dto';
import { TranslateTextReqDto } from './dtos/translate/translate-text.req.dto';
import { AddFavTranslationReqDto } from './dtos/translate/add-fav-translation.req.dto';
import { TranslateService } from './services/translate.service';
import { InstructionService } from './services/instruction.service';

@Controller("api")
export class AppController {
  constructor(private translateService: TranslateService, private instructionService: InstructionService) { }

  @Post('translate')
  async translate(@Body() body: TranslateTextReqDto) {
    return this.translateService.translateText(body);
  }

  @Get('favorites/translations')
  async getFavTranslations() {
    return this.translateService.getFavTranslations();
  }

  @Post('favorites/translations')
  async addFavTranslation(@Body() body: AddFavTranslationReqDto) {
    return this.translateService.addFavTranslation(body);
  }

  @Delete('favorites/translations/:id/delete')
  async deleteFavTranslation(@Param('id') id: string) {
    return this.translateService.deleteFavTranslation(id);
  }

  @Get('instructions')
  async getInstructions() {
    return this.instructionService.getInstructions();
  }

  @Post('instructions')
  async createInstruction(@Body() createInstructionDto: CreateInstructionDto) {
    return this.instructionService.createInstruction(createInstructionDto);
  }

  @Patch('instructions/:id/update')
  async updateInstruction(
    @Param('id') id: string,
    @Body() updateInstructionDto: UpdateInstructionDto,
  ) {
    return this.instructionService.updateInstruction(id, updateInstructionDto);
  }

  @Delete('instructions/:id/delete')
  async deleteInstruction(@Param('id') id: string) {
    return this.instructionService.deleteInstruction(id);
  }
}
