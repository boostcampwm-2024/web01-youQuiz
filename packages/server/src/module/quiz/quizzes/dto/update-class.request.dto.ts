import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateClassRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
