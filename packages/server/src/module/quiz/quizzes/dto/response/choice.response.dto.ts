import { Expose } from 'class-transformer';
import { Choice } from '../../entities/choice.entity';
import { ChoiceResponse } from '@shared/interfaces/response/choice.response.interface';

export class ChoiceResponseDto implements ChoiceResponse {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  isCorrect: boolean;

  @Expose()
  position: number;

  static fromEntity(entity: Choice): ChoiceResponseDto {
    const dto = new ChoiceResponseDto();
    dto.id = entity.id;
    dto.content = entity.content;
    dto.isCorrect = entity.isCorrect;
    dto.position = entity.position;
    return dto;
  }
}
