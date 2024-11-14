import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
