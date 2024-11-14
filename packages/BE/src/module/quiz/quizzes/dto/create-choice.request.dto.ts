import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateChoiceRequestDto {
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