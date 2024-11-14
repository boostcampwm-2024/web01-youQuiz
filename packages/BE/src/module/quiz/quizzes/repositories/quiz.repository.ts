import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Choice } from '../entities/choice.entity';
import { CreateQuizRequestDto } from '../dto/create-quiz.request.dto';
import { UpdateQuizRequestDto } from '../dto/update-quiz.request.dto';

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
    return await this.repository.save(quizEntity);
  }

  async findById(id: number): Promise<Quiz> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Quiz[]> {
    return this.repository.find();
  }

  async findByClassId(classId: number): Promise<Quiz[]> {
    return this.repository.find({ where: { classId } });
  }

  async deleteByClassId(classId: number): Promise<void> {
    await this.repository.delete({ classId });
  }

  async updateQuizzes(classId: number, quizDataList: UpdateQuizRequestDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 기존 퀴즈 목록 조회
      const existingQuizzes = await queryRunner.manager.find(Quiz, {
        where: { classId },
        relations: ['choices'],
      });

      // 2. 업데이트할 퀴즈 ID 목록
      const incomingQuizIds = quizDataList.filter((quiz) => quiz.id).map((quiz) => quiz.id);

      // 3. 삭제할 퀴즈 처리
      const quizIdsToDelete = existingQuizzes
        .map((quiz) => quiz.id)
        .filter((id) => !incomingQuizIds.includes(id));

      if (quizIdsToDelete.length > 0) {
        await queryRunner.manager.delete(Quiz, quizIdsToDelete);
      }

      // 4. 퀴즈 업데이트/생성 처리
      await Promise.all(
        quizDataList.map(async (quizData) => {
          if (quizData.id) {
            // 4-1. 기존 퀴즈 업데이트
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
            // 4-2. 새로운 퀴즈 생성
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
        }),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
