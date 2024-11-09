import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateQuizRequestDto {
    @IsNumber()
    @IsNotEmpty()
    creator_id: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    time_limit: number;

    @IsNumber()
    @IsNotEmpty()
    point: number;

    @IsNumber()
    @IsNotEmpty()
    question_type: number;

    @IsNumber()
    @IsNotEmpty()
    position: number;
}