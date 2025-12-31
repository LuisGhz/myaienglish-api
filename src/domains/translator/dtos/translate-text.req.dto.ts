import { IsOptional, IsString } from 'class-validator';

export class TranslateTextReqDto {
  @IsString()
  @IsOptional()
  context?: string;

  @IsString()
  textToTranslate: string;
}
