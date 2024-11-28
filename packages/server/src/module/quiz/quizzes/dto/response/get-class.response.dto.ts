import { Expose, plainToInstance, Type } from 'class-transformer';
import { Class } from '../../entities/class.entity';
import { QuizResponseDto } from './quiz.response.dto';

export class GetClassResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  @Type(() => QuizResponseDto)
  quizzes: QuizResponseDto[];

  static fromEntity(entity: Class): GetClassResponseDto {
    return plainToInstance(GetClassResponseDto, entity, { excludeExtraneousValues: true });
  }
}
