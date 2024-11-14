import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateClassRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}