import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateChoiceRequestDto } from './update-choice.request.dto';
import { QuizType } from '../utils/quiz-type.enum';

export class UpdateQuizRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(QuizType)
  @IsNotEmpty()
  quizType: QuizType;

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;

  @IsNumber()
  @IsNotEmpty()
  point: number;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChoiceRequestDto)
  choices: UpdateChoiceRequestDto[];
}
