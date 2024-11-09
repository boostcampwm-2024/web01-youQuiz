import { IsNotEmpty, IsString, IsNumber} from 'class-validator';

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
}
