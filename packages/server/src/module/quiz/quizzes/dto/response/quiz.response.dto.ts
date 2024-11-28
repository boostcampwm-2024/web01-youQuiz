import { QuizResponse } from '@shared/interfaces/response/quiz.response.interface';
import { ChoiceResponseDto } from '../response/choice.response.dto';
import { Quiz } from '../../entities/quiz.entity';
import { Expose, Type } from 'class-transformer';

export class QuizResponseDto implements QuizResponse {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  quizType: string;

  @Expose()
  timeLimit: number;

  @Expose()
  point: number;

  @Expose()
  position: number;

  @Expose()
  @Type(() => ChoiceResponseDto)
  choices: ChoiceResponseDto[];

  static fromEntity(entity: Quiz): QuizResponseDto {
    const dto = new QuizResponseDto();
    dto.id = entity.id;
    dto.content = entity.content;
    dto.quizType = entity.quizType;
    dto.timeLimit = entity.timeLimit;
    dto.point = entity.point;
    dto.position = entity.position;
    dto.choices = entity.choices.map((choice) => ChoiceResponseDto.fromEntity(choice));
    return dto;
  }
}
