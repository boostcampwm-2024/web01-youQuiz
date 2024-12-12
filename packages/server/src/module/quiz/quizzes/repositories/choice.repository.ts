import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Choice } from '../entities/choice.entity';
import { CreateChoiceRequestDto } from '../dto/request/create-choice.request.dto';

@Injectable()
export class ChoiceRepository {
  constructor(
    @InjectRepository(Choice)
    private readonly repository: Repository<Choice>,
  ) {}

  async create(quizId: number, choiceData: CreateChoiceRequestDto): Promise<Choice> {
    const { content, isCorrect, position } = choiceData;
    const choiceEntity = this.repository.create({
      quizId,
      content,
      isCorrect,
      position,
      createdAt: new Date(),
    });
    try {
      return await this.repository.save(choiceEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create choice');
    }
  }

  async createBulkChoices(manager: EntityManager, choiceData: any[]) {
    try {
      if (!choiceData.length) {
        throw new Error('Choice data array is empty');
      }

      return await manager.createQueryBuilder().insert().into(Choice).values(choiceData).execute();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create choices');
    }
  }

  async findById(id: number): Promise<Choice> {
    try {
      const choice = await this.repository.findOne({ where: { id } });
      if (!choice) {
        throw new NotFoundException(`Choice with ID ${id} not found`);
      }
      return choice;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to find choice');
    }
  }

  async findAll(): Promise<Choice[]> {
    try {
      const result = await this.repository.find();
      if (!result) {
        throw new NotFoundException(`No choices found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch choices');
    }
  }

  async deleteByClassId(classId: number, manager: EntityManager): Promise<void> {
    await manager.query(
      'DELETE FROM choice WHERE quiz_id IN (SELECT id FROM quiz WHERE class_id = ?)',
      [classId],
    );
  }
}
