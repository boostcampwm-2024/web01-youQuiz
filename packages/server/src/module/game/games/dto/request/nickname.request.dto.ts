import { NicknameRequest } from '@shared/interfaces/request/nickname.request.interface';
import { IsString } from 'class-validator';

export class NicknameRequestDto implements NicknameRequest {
  @IsString()
  pinCode: string;
}
