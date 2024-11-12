import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { CreateQuizRequestDto } from '../dto/create-quiz.request.dto';

@Injectable()
export class QuizRepository {
    constructor(
        @InjectRepository(Quiz)
        private readonly repository: Repository<Quiz>
    ) {}

    async create(class_id: number, quiz: CreateQuizRequestDto): Promise<Quiz> {
        const { content, quizType: quiz_type, timeLimit: time_limit, position, point } = quiz;
        const quizEntity = this.repository.create({
            class_id,
            content,
            quiz_type,
            time_limit,
            position,
            point,
            created_at: new Date(),
        });
        return await this.repository.save(quizEntity);
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

    async deleteByClassId(class_id: number): Promise<void> {
        await this.repository.delete({ class_id });
    }
}