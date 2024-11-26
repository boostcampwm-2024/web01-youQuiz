import { QuizResponse } from '@shared/interfaces/response/quiz.response.interface';
import { ChoiceResponseDto } from './choice.response.dto';
import { Quiz } from '../entities/quiz.entity';

export class QuizResponseDto implements QuizResponse {
  id: number;
  content: string;
  quizType: string;
  timeLimit: number;
  point: number;
  position: number;
  choices: ChoiceResponseDto[];

  static fromEntity(entity: Quiz): QuizResponseDto {
    const dto = new QuizResponseDto();
    dto.id = entity.id;
    dto.content = entity.content; // Assuming `content` maps to `question` in `Quiz` entity
    dto.quizType = entity.quizType;
    dto.timeLimit = entity.timeLimit;
    dto.point = entity.point;
    dto.position = entity.position;
    dto.choices = entity.choices.map((choice) => ChoiceResponseDto.fromEntity(choice));
    return dto;
  }
}
