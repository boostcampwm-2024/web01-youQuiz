import { Injectable, HttpException, HttpStatus, Param, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QuizRepository } from './repositories/quiz.repository';
import { ChoiceRepository } from './repositories/choice.repository';
import { ClassRepository } from './repositories/class.repository';
import { CreateClassRequestDto } from './dto/create-class.request.dto';
import { CreateQuizListRequestDto } from './dto/create-quizlist.request.dto';
import { ResponseDto } from '../../utils/dto/response.dto';
import { Quiz } from './entities/quiz.entity';
import { ClassResponseDto } from './dto/class.response.dto';
import { QuizResponseDto } from './dto/quiz.response.dto';
import { UpdateClassRequestDto } from './dto/update-class.request.dto';
import { UpdateQuizRequestDto } from './dto/update-quiz.request.dto';
import { UpdateQuizListRequestDto } from './dto/update-quizlist.request.dto';
import { CreateClassResponseDto } from './dto/create-class.response.dto';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly choiceRepository: ChoiceRepository,
    private readonly classRepository: ClassRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getClasses(): Promise<ClassResponseDto[]> {
    const classes = await this.classRepository.findAll();
    return classes.map(ClassResponseDto.fromEntity);
  }

  async getQuizzesByClassId(classId: number): Promise<any> {
    const quizzes = await this.quizRepository.findByClassId(classId);

    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException(`No quizzes found for classId ${classId}`);
    }

    return quizzes.map((quiz) => QuizResponseDto.fromEntity(quiz));
  }

  async createClass(createClassRequestDto: CreateClassRequestDto): Promise<CreateClassResponseDto> {
    try {
      const classEntity = await this.classRepository.create(createClassRequestDto);
      return CreateClassResponseDto.fromEntity(classEntity);
    } catch (error) {
      console.error('error:', error);
      throw error;
    }
  }

  // dto가 여러개라서 처리하기 좀 그러네 quiz, choice는 dto가 아니라 인터페이스로 구현하는게 좋지않을까라는 생각...?
  async createQuiz(classId: number, quizData: CreateQuizListRequestDto): Promise<ResponseDto> {
    // 그럼 이 컨트롤러에서 dto 구분이 힘들다
    // 너무 이 메서드에 책임이 많은게 아닌가 라는 생각도 든다.
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    try {
      // class_id가 유효한지 확인
      const is_valid_class = await this.classRepository.findClassById(classId);
      if (!is_valid_class) {
        throw new Error(`Class with ID ${classId} not found`);
      }

      await Promise.all(
        quizData.quizzes.map(async (quiz) => {
          const quizEntity = await this.quizRepository.create(classId, quiz);
          quiz.choices.map(async (choice) => {
            this.choiceRepository.create(quizEntity.id, choice);
          });
        }),
      );

      // await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        message: 'Quiz created successfully',
      };
    } catch (error) {
      // await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          error: `${error}`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
    // } finally {
    //     await queryRunner.release();
    // }
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizRepository.findAll();
  }

  // id에 해당하는 클래스와 퀴즈, 선택지를 삭제한다.
  async deleteClass(id: number): Promise<ResponseDto> {
    try {
      const classEntity = await this.classRepository.findClassWithRelations(id);

      if (!classEntity) {
        throw new HttpException(`Class with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      await this.classRepository.deleteWithRelations(classEntity);

      return {
        statusCode: HttpStatus.OK,
        message: 'Class and all related entities deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Failed to delete class: ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // id에 해당하는 클래스의 정보를 수정한다.
  async updateClass(id: number, updateData: UpdateClassRequestDto): Promise<ResponseDto> {
    try {
      const classEntity = await this.classRepository.findById(id);

      if (!classEntity) {
        throw new HttpException(`Class with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      await this.classRepository.update(id, updateData);

      return {
        statusCode: HttpStatus.OK,
        message: 'Class updated successfully',
      };
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateQuiz(classId: number, dto: UpdateQuizListRequestDto): Promise<ResponseDto> {
    try {
      const quizEntity = await this.classRepository.findById(classId);
      if (!quizEntity) {
        throw new HttpException(`Quiz with ID ${classId} not found`, HttpStatus.NOT_FOUND);
      }

      await this.quizRepository.updateQuizzes(classId, dto.quizzes);

      return {
        statusCode: HttpStatus.OK,
        message: 'Quiz updated successfully',
      };
    } catch (error) {
      throw new HttpException(`error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
