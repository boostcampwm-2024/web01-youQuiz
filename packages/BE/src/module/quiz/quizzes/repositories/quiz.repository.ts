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
        const quizEntity = this.repository.create({
            class_id,
            position: quiz.position,
            content: quiz.content,
            time_limit: quiz.timeLimit,
            point: quiz.point,
            question_type: quiz.questionType,
        });
        return await this.repository.save(quizEntity); // 실제로 데이터베이스에 저장
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