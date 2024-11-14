import { Injectable } from '@nestjs/common';
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
    const { title, description } = classData;
    const classEntity = this.repository.create({
      title,
      description,
      createdAt: new Date(),
    });
    return this.repository.save(classEntity);
  }

  async findById(id: number): Promise<Class> {
    return this.repository.findOne({ where: { id } });
  }

  async findClassById(id: number): Promise<Class> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Class[]> {
    return this.repository.find();
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findClassWithRelations(id: number): Promise<Class> {
    return this.repository.findOne({
      where: { id },
      relations: {
        quizzes: {
          choices: true,
        },
      },
    });
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

  async update(id: number, classData: Partial<Class>): Promise<void> {
    const { title, description } = classData;
    await this.repository.update(id, {
      title,
      description,
    });
  }
}
