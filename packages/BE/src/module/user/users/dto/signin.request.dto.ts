import { IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class SignInRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}