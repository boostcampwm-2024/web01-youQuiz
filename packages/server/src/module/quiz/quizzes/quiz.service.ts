import {
  Injectable,
  HttpException,
  HttpStatus,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QuizRepository } from './repositories/quiz.repository';
import { ChoiceRepository } from './repositories/choice.repository';
import { ClassRepository } from './repositories/class.repository';
import { CreateClassRequestDto } from './dto/request/create-class.request.dto';
import { CreateClassResponseDto } from './dto/response/create-class.response.dto';
import { CreateQuizListRequestDto } from './dto/request/create-quizlist.request.dto';
import { ResponseDto } from '../../utils/dto/response.dto';
import { Quiz } from './entities/quiz.entity';
import { QuizResponseDto } from './dto/response/quiz.response.dto';
import { UpdateClassRequestDto } from './dto/request/update-class.request.dto';
import { UpdateQuizRequestDto } from './dto/request/update-quiz.request.dto';
import { UpdateQuizListRequestDto } from './dto/request/update-quizlist.request.dto';
import { GetClassResponseDto } from './dto/response/get-class.response.dto';
import { Class } from './entities/class.entity';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly choiceRepository: ChoiceRepository,
    private readonly classRepository: ClassRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createClass(createClassRequestDto: CreateClassRequestDto): Promise<CreateClassResponseDto> {
    const classEntity = await this.classRepository.create(createClassRequestDto);

    const responseDto = CreateClassResponseDto.fromEntity(classEntity);

    return responseDto;
  }

  async createQuiz(classId: number, quizData: CreateQuizListRequestDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.classRepository.findClassById(classId);
      await Promise.all(
        quizData.quizzes.map(async (quiz) => {
          const quizEntity = await this.quizRepository.create(classId, quiz);
          await Promise.all(
            quiz.choices.map(async (choice) => {
              await this.choiceRepository.create(quizEntity.id, choice);
            }),
          );
        }),
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create quiz');
    } finally {
      await queryRunner.release();
    }
  }

  async getAllClasses(): Promise<GetClassResponseDto[]> {
    const classEntities = await this.classRepository.findAll();

    return classEntities.map((classEntity: Class) => GetClassResponseDto.fromEntity(classEntity));
  }

  async getQuizzesByClassId(classId: number): Promise<any> {
    const quizzes = await this.quizRepository.findByClassId(classId);

    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException(`No quizzes found for classId ${classId}`);
    }

    return quizzes.map((quiz) => QuizResponseDto.fromEntity(quiz));
  }

  async updateClass(id: number, updateData: UpdateClassRequestDto): Promise<void> {
    const classEntity = await this.classRepository.findById(id);

    if (!classEntity) {
      throw new HttpException(`Class with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.classRepository.update(id, updateData);
  }

  async updateQuiz(classId: number, dto: UpdateQuizListRequestDto): Promise<void> {
    const quizEntity = await this.classRepository.findById(classId);

    if (!quizEntity) {
      throw new HttpException(`Quiz with ID ${classId} not found`, HttpStatus.NOT_FOUND);
    }

    await this.quizRepository.updateQuizzes(classId, dto.quizzes);
  }

  async deleteClass(id: number): Promise<void> {
    await this.classRepository.deleteWithRelations(id);
  }
}
