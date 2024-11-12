import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { CreateChoiceRequestDto } from "./create-choice.request.dto";
import { QuizType } from '../utils/quiz-type.enum';

export class CreateQuizRequestDto {
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
    @Type(() => CreateChoiceRequestDto)
    choices: CreateChoiceRequestDto[];
}