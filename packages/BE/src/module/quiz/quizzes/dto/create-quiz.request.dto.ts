import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateChoiceRequestDto } from "./create-choice.request.dto";

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

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateChoiceRequestDto)
    choices: CreateChoiceRequestDto[];
}