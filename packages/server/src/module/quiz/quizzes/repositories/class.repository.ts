import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Class } from '../entities/class.entity';

@Injectable()
export class ClassRepository {
  constructor(
    @InjectRepository(Class)
    private readonly repository: Repository<Class>,
    private readonly dataSource: DataSource,
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
        order: {
          quizzes: {
            position: 'ASC',
            choices: {
              position: 'ASC',
            },
          },
        },
      });
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

  async deleteWithRelations(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(
        `DELETE FROM choice WHERE quiz_id IN (SELECT id FROM quiz WHERE class_id = ?)`,
        [id],
      );

      await queryRunner.query(`DELETE FROM quiz WHERE class_id = ?`, [id]);

      await queryRunner.query(`DELETE FROM class WHERE id = ?`, [id]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to delete');
    } finally {
      await queryRunner.release();
    }
  }
}
