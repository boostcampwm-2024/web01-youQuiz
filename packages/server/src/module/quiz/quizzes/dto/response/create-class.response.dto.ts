import { Expose } from 'class-transformer';
import { Class } from '../../entities/class.entity';
import { QuizResponseDto } from './quiz.response.dto';

export class CreateClassResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  static fromEntity(entity: Class): CreateClassResponseDto {
    const dto = new CreateClassResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    return dto;
  }
}
