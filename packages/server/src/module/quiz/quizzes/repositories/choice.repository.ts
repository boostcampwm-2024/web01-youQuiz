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

  async create(
    quizId: number,
    choiceData: CreateChoiceRequestDto,
    manager?: EntityManager,
  ): Promise<Choice> {
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

  async deleteByQuizId(quizId: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(Choice) : this.repository;
    try {
      await repo.delete({ quizId });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete choices');
    }
  }
}
