import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../entities/class.entity';
import { Quiz } from '../entities/quiz.entity';
import { Choice } from '../entities/choice.entity';

@Injectable()
export class ClassRepository {
  constructor(
    @InjectRepository(Class)
    private readonly repository: Repository<Class>,
  ) {}

  async create(classData: Partial<Class>): Promise<Class> {
    try {
      const { title, description } = classData;
      const classEntity = this.repository.create({
        title,
        description,
        createdAt: new Date(),
      });
      return this.repository.save(classEntity);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create class');
    }
  }

  async findAll(): Promise<Class[]> {
    try {
      const result = await this.repository.find({
        relations: {
          quizzes: {
            choices: true,
          },
        },
      });
      if (!result) {
        throw new NotFoundException(`No classes found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch classes');
    }
  }

  async findById(id: number): Promise<Class> {
    try {
      const result = await this.repository.findOne({ where: { id } });
      if (!result) {
        throw new NotFoundException(`Class with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch class');
    }
  }

  async findClassById(id: number): Promise<Class> {
    try {
      const result = await this.repository.findOne({ where: { id } });
      if (!result) {
        throw new NotFoundException(`Class with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch class');
    }
  }

  async getOnlyQuiz(id: number) {
    try {
      const result = await this.repository.findOne({
        where: { id },
        select: ['quizzes'],
        relations: {
          quizzes: {
            choices: true,
          },
        },
      });
      if (!result) {
        throw new NotFoundException(`Class with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch class with relations');
    }
  }

  async findClassWithRelations(id: number): Promise<Class> {
    try {
      const result = await this.repository.findOne({
        where: { id },
        relations: {
          quizzes: {
            choices: true,
          },
        },
      });
      if (!result) {
        throw new NotFoundException(`Class with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch class with relations');
    }
  }

  async update(id: number, classData: Partial<Class>): Promise<void> {
    try {
      const { title, description } = classData;
      await this.repository.update(id, {
        title,
        description,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update class');
    }
  }

  async deleteWithRelations(classEntity: Class): Promise<void> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 먼저 모든 하위 Choice 삭제
      if (classEntity.quizzes) {
        for (const quiz of classEntity.quizzes) {
          if (quiz.choices && quiz.choices.length > 0) {
            await queryRunner.manager.delete(Choice, {
              quizId: quiz.id,
            });
          }
        }
      }

      // 2. Quiz 삭제
      if (classEntity.quizzes && classEntity.quizzes.length > 0) {
        await queryRunner.manager.delete(Quiz, {
          classId: classEntity.id,
        });
      }

      // 3. 마지막으로 Class 삭제
      await queryRunner.manager.delete(Class, {
        id: classEntity.id,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error('Failed to delete class with relations:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
