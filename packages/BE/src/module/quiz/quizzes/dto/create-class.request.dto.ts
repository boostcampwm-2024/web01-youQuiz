import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuizRequestDto } from '../../quizzes/dto/create-quiz.request.dto';

export class CreateClassRequestDto {
    @IsNumber()
    @IsNotEmpty()
    creator_id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuizRequestDto)
    quizzes: CreateQuizRequestDto[];
}
