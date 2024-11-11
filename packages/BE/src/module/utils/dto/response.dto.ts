import { IsString, IsBoolean } from 'class-validator';

export class ResponseDto {
    @IsBoolean()
    success: boolean;

    @IsString()
    message: string;
}   