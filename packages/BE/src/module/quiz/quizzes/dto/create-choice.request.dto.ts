import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateChoiceRequestDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    is_correct: boolean;
}