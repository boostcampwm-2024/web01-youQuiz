import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ChoiceRepository } from '../../quiz/quizzes/repositories/choice.repository';
import { ClassRepository } from '../../quiz/quizzes/repositories/class.repository';
import { QuizRepository } from '../../quiz/quizzes/repositories/quiz.repository';

@Injectable()
export class GameService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly quizRepository: QuizRepository,
    private readonly choiceRepository: ChoiceRepository,
  ) {}

  async cachingQuizData(classId: number) {
    const classWithRelations = await this.classRepository.findClassWithRelations(classId);

    return classWithRelations;
  }
}
