import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateInstructionDto } from './dtos/instructions/create-instruction.dto';
import { UpdateInstructionDto } from './dtos/instructions/update-instruction.dto';
import { TranslateTextReqDto } from './dtos/translate/translate-text.req.dto';
import { AddFavTranslationReqDto } from './dtos/translate/add-fav-translation.req.dto';

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('translate')
  async translate(@Body() body: TranslateTextReqDto) {
    return this.appService.translateText(body);
  }

  @Get('favorites/translations')
  async getFavTranslations() {
    return this.appService.getFavTranslations();
  }

  @Post('favorites/translations')
  async addFavTranslation(@Body() body: AddFavTranslationReqDto) {
    return this.appService.addFavTranslation(body);
  }

  @Delete('favorites/translations/:id/delete')
  async deleteFavTranslation(@Param('id') id: string) {
    return this.appService.deleteFavTranslation(id);
  }

  @Get('instructions')
  async getInstructions() {
    return this.appService.getInstructions();
  }

  @Post('instructions')
  async createInstruction(@Body() createInstructionDto: CreateInstructionDto) {
    return this.appService.createInstruction(createInstructionDto);
  }

  @Patch('instructions/:id/update')
  async updateInstruction(
    @Param('id') id: string,
    @Body() updateInstructionDto: UpdateInstructionDto,
  ) {
    return this.appService.updateInstruction(id, updateInstructionDto);
  }

  @Delete('instructions/:id/delete')
  async deleteInstruction(@Param('id') id: string) {
    return this.appService.deleteInstruction(id);
  }
}
