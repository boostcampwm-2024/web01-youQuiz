import { IsString, IsNumber } from 'class-validator';

export class ResponseDto {
  @IsNumber()
  statusCode: number;

  @IsString()
  message: string;
}
