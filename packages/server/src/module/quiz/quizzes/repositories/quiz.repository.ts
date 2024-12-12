import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Choice } from '../entities/choice.entity';
import { CreateQuizRequestDto } from '../dto/request/create-quiz.request.dto';
import { UpdateQuizRequestDto } from '../dto/request/update-quiz.request.dto';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repository: Repository<Quiz>,
    private readonly dataSource: DataSource,
  ) {}

  async create(classId: number, quiz: CreateQuizRequestDto): Promise<Quiz> {
    const { content, quizType, timeLimit, position, point } = quiz;
    const quizEntity = this.repository.create({
      classId,
      content,
      quizType,
      timeLimit,
      position,
      point,
      createdAt: new Date(),
    });
    try {
      return await this.repository.save(quizEntity);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create quiz');
    }
  }

  async createBulkQuizzes(manager: EntityManager, quizData: any[]) {
    try {
      if (!quizData.length) {
        throw new Error('Quiz data array is empty');
      }

      return await manager.createQueryBuilder().insert().into(Quiz).values(quizData).execute();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create quizzes');
    }
  }

  async findAll(): Promise<Quiz[]> {
    try {
      const result = await this.repository.find();
      if (!result) {
        throw new NotFoundException(`No quizzes found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  async findByClassId(classId: number): Promise<Quiz[]> {
    try {
      const result = await this.repository.find({
        where: { class: { id: classId } },
        relations: ['choices'],
      });
      if (!result) {
        throw new NotFoundException(`No quizzes found for classId ${classId}`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  async updateQuizzes(classId: number, quizDataList: UpdateQuizRequestDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 클래스에 속한 모든 기존 퀴즈와 선택지 조회
      const existingQuizzes = await queryRunner.manager.find(Quiz, {
        where: { classId },
        relations: ['choices'],
      });

      // 2. 업데이트할 퀴즈 ID 목록
      const incomingQuizIds = quizDataList.filter((quiz) => quiz.id).map((quiz) => quiz.id);

      // 3. 삭제할 퀴즈 찾기
      const quizzesToDelete = existingQuizzes.filter((quiz) => !incomingQuizIds.includes(quiz.id));

      // 4. 삭제 처리 (선택지 먼저 삭제 후 퀴즈 삭제)
      if (quizzesToDelete.length > 0) {
        // 4-1. 삭제할 퀴즈들의 모든 선택지 삭제
        for (const quiz of quizzesToDelete) {
          const choiceIds = quiz.choices.map((choice) => choice.id);
          if (choiceIds.length > 0) {
            await queryRunner.manager.delete(Choice, choiceIds);
          }
        }

        // 4-2. 퀴즈 삭제
        const quizIds = quizzesToDelete.map((quiz) => quiz.id);
        await queryRunner.manager.delete(Quiz, quizIds);
      }

      // 5. 나머지 퀴즈 업데이트/생성 처리
      for (const quizData of quizDataList) {
        if (quizData.id) {
          // 5-1. 기존 퀴즈 업데이트
          const quiz = await queryRunner.manager.findOne(Quiz, {
            where: { id: quizData.id, classId },
            relations: ['choices'],
          });

          if (!quiz) {
            throw new NotFoundException(
              `Quiz with ID ${quizData.id} not found in class ${classId}`,
            );
          }

          // Quiz 기본 정보 업데이트
          await queryRunner.manager.update(Quiz, quiz.id, {
            content: quizData.content,
            quizType: quizData.quizType,
            timeLimit: quizData.timeLimit,
            point: quizData.point,
            position: quizData.position,
          });

          // Choices 처리
          const existingChoiceIds = quiz.choices.map((c) => c.id);
          const incomingChoiceIds = quizData.choices.filter((c) => c.id).map((c) => c.id);

          // 삭제할 Choices 처리
          const choiceIdsToDelete = existingChoiceIds.filter(
            (id) => !incomingChoiceIds.includes(id),
          );
          if (choiceIdsToDelete.length > 0) {
            await queryRunner.manager.delete(Choice, choiceIdsToDelete);
          }

          // Choice 업데이트/생성 처리
          await Promise.all(
            quizData.choices.map(async (choiceData) => {
              if (choiceData.id) {
                return queryRunner.manager.update(Choice, choiceData.id, {
                  content: choiceData.content,
                  isCorrect: choiceData.isCorrect,
                  position: choiceData.position,
                });
              } else {
                const newChoice = new Choice();
                newChoice.quizId = quiz.id;
                newChoice.content = choiceData.content;
                newChoice.isCorrect = choiceData.isCorrect;
                newChoice.position = choiceData.position;
                newChoice.createdAt = new Date();
                return queryRunner.manager.save(Choice, newChoice);
              }
            }),
          );
        } else {
          // 5-2. 새로운 퀴즈 생성
          const newQuiz = new Quiz();
          newQuiz.classId = classId;
          newQuiz.content = quizData.content;
          newQuiz.quizType = quizData.quizType;
          newQuiz.timeLimit = quizData.timeLimit;
          newQuiz.point = quizData.point;
          newQuiz.position = quizData.position;
          newQuiz.createdAt = new Date();

          const savedQuiz = await queryRunner.manager.save(Quiz, newQuiz);

          // 새 퀴즈의 선택지들 생성
          await Promise.all(
            quizData.choices.map(async (choiceData) => {
              const newChoice = new Choice();
              newChoice.quizId = savedQuiz.id;
              newChoice.content = choiceData.content;
              newChoice.isCorrect = choiceData.isCorrect;
              newChoice.position = choiceData.position;
              newChoice.createdAt = new Date();
              return queryRunner.manager.save(Choice, newChoice);
            }),
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByClassId(classId: number, manager: EntityManager): Promise<void> {
    await manager.query('DELETE FROM quiz WHERE class_id = ?', [classId]);
  }
}
