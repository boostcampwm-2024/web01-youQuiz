import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateChoiceRequestDto } from "./create-choice.request.dto";

export class CreateQuizRequestDto {
    @IsNumber()
    @IsNotEmpty()
    position: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    timeLimit: number;

    @IsNumber()
    @IsNotEmpty()
    point: number;

    @IsString()
    @IsNotEmpty()
    questionType: string;

    // @IsNumber()
    // @IsNotEmpty()
    // position: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateChoiceRequestDto)
    choices: CreateChoiceRequestDto[];
}