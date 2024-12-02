import { Expose } from 'class-transformer';

export class EndQuizResponseDto {
  @Expose()
  isEnded: Boolean;

  constructor(isEnd: Boolean) {
    this.isEnded = isEnd;
  }
}
