import { Class } from '../entities/class.entity';

export class CreateClassResponseDto {
  id: number;
  title: string;

  static fromEntity(entity: Class): CreateClassResponseDto {
    const dto = new CreateClassResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    return dto;
  }
}
