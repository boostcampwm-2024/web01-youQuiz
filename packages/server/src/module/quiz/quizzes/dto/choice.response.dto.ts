import { Choice } from '../entities/choice.entity';
import { ChoiceResponse } from '@shared/interfaces/response/choice.response.interface';

export class ChoiceResponseDto implements ChoiceResponse {
  id: number;
  content: string;
  isCorrect: boolean;
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
