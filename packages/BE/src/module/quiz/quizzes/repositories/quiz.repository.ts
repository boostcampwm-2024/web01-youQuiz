import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';

@Injectable()
export class QuizRepository {
    constructor(
        @InjectRepository(Quiz)
        private readonly repository: Repository<Quiz>
    ) {}

    async create(quiz: Partial<Quiz>): Promise<Quiz> {
        return this.repository.save(quiz);
    }

    async findById(id: number): Promise<Quiz> {
        return this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<Quiz[]> {
        return this.repository.find();
    }

    async findByClassId(class_id: number): Promise<Quiz[]> {
        return this.repository.find({ where: { class_id } });
    }
}