import { Expose } from 'class-transformer';

export class StartQuizResponseDto {
  @Expose()
  isStarted: Boolean;

  constructor(isStarted: Boolean) {
    this.isStarted = isStarted;
  }
}
