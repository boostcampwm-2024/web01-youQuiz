import { IsNumber, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuizRequestDto } from './create-quiz.request.dto';

export class CreateQuizListRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuizRequestDto)
    quizzes: CreateQuizRequestDto[];
}