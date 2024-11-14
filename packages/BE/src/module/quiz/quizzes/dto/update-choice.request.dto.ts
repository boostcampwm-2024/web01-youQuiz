import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateChoiceRequestDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;
}
