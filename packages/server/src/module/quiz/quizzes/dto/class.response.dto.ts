import { Class } from '../entities/class.entity';

export class ClassResponseDto {
  id: number;
  title: string;

  static fromEntity(entity: Class): ClassResponseDto {
    const dto = new ClassResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    return dto;
  }
}
