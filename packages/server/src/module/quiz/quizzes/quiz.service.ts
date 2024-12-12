import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { QuizRepository } from './repositories/quiz.repository';
import { ChoiceRepository } from './repositories/choice.repository';
import { ClassRepository } from './repositories/class.repository';
import { CreateClassRequestDto } from './dto/request/create-class.request.dto';
import { CreateClassResponseDto } from './dto/response/create-class.response.dto';
import { CreateQuizListRequestDto } from './dto/request/create-quizlist.request.dto';
import { QuizResponseDto } from './dto/response/quiz.response.dto';
import { UpdateClassRequestDto } from './dto/request/update-class.request.dto';
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

  async createBulkQuizWithChoices(
    classId: number,
    quizData: CreateQuizListRequestDto,
  ): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      await this.classRepository.findClassById(classId);

      const quizValues = this.prepareQuizData(classId, quizData);
      const insertedQuizzes = await this.quizRepository.createBulkQuizzes(manager, quizValues);

      const choiceValues = this.prepareChoiceData(quizData, insertedQuizzes);
      await this.choiceRepository.createBulkChoices(manager, choiceValues);
    });
  }

  private prepareQuizData(classId: number, quizData: CreateQuizListRequestDto) {
    return quizData.quizzes.map((quiz) => ({
      classId,
      content: quiz.content,
      quizType: quiz.quizType,
      timeLimit: quiz.timeLimit,
      point: quiz.point,
      position: quiz.position,
      createdAt: new Date(),
    }));
  }

  private prepareChoiceData(quizData: CreateQuizListRequestDto, insertedQuizzes: InsertResult) {
    const quizIds = insertedQuizzes.identifiers.map((identifier) => identifier.id);
    return quizData.quizzes.flatMap((quiz, index) =>
      quiz.choices.map((choice) => ({
        quizId: quizIds[index],
        content: choice.content,
        isCorrect: choice.isCorrect,
        position: choice.position,
        createdAt: new Date(),
      })),
    );
  }

  async getAllClasses(): Promise<GetClassResponseDto[]> {
    const classEntities = await this.classRepository.findAll();

    return classEntities.map((classEntity: Class) => GetClassResponseDto.fromEntity(classEntity));
  }

  async getQuizzesByClassId(classId: number): Promise<QuizResponseDto[]> {
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
    return this.dataSource.transaction(async (manager) => {
      await this.classRepository.findClassById(id);
      await this.choiceRepository.deleteByClassId(id, manager);
      await this.quizRepository.deleteByClassId(id, manager);
      await this.classRepository.delete(id, manager);
    });
  }
}
