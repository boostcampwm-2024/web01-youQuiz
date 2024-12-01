import { Expose } from 'class-transformer';

export class MessageResponseDto {
  @Expose()
  message: string;

  @Expose()
  position: number;

  constructor(message: string, position: number) {
    this.message = message;
    this.position = position;
  }
}
