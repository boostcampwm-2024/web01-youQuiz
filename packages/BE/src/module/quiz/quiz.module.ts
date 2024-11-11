import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quizzes/entities/quiz.entity';
import { Choice } from './quizzes/entities/choice.entity';
import { Class } from './quizzes/entities/class.entity';
import { QuizRepository } from './quizzes/repositories/quiz.repository';
import { ChoiceRepository } from './quizzes/repositories/choice.repository';
import { ClassRepository } from './quizzes/repositories/class.repository';
import { QuizService } from './quizzes/quiz.service';
import { QuizController } from './quizzes/quiz.controller';


@Module({
    imports: [
        TypeOrmModule.forFeature([Quiz, Choice, Class])
    ],
    controllers: [QuizController],
    providers: [
        QuizService,
        QuizRepository,
        ChoiceRepository,
        ClassRepository
    ],
    exports: [
        QuizRepository,
        ChoiceRepository,
        ClassRepository
    ]
})
export class QuizModule {}