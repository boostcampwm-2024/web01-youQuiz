import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizRepository } from './repositories/quiz.repository';
import { ChoiceRepository } from './repositories/choice.repository';
import { ClassRepository } from './repositories/class.repository';
import { CreateQuizRequestDto } from './dto/create-quiz.request.dto';
import { Quiz } from './entities/quiz.entity';

@Injectable()
export class QuizService {
    constructor(
        private readonly quizRepository: QuizRepository,
        private readonly choiceRepository: ChoiceRepository,
        private readonly classRepository: ClassRepository
    ) {}

    // async createQuiz(createQuizRequestDto: CreateQuizRequestDto): Promise<Quiz> {}

    async findAll(): Promise<Quiz[]> {
        return this.quizRepository.findAll();
    }

    async findById(id: number): Promise<Quiz> {
        const quiz = await this.quizRepository.findById(id);
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        return quiz;
    }

    async findByClassId(class_id: number): Promise<Quiz[]> {
        const classExists = await this.classRepository.findById(class_id);
        if (!classExists) {
            throw new NotFoundException(`Class with ID ${class_id} not found`);
        }
        return this.quizRepository.findByClassId(class_id);
    }

    // async updateQuiz(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {}

    // async deleteQuiz(id: number): Promise<void> {}
}