import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateQuizRequestDto } from './update-quiz.request.dto';

export class UpdateQuizListRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuizRequestDto)
  quizzes: UpdateQuizRequestDto[];
}
