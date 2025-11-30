import { IsOptional, IsString } from 'class-validator';

export class TranslateTextReqDto {
  @IsString()
  instructionId: string;

  @IsString()
  @IsOptional()
  context?: string;

  @IsString()
  textToTranslate: string;
}
