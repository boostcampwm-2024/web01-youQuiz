import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ChoiceRepository } from '../../quiz/quizzes/repositories/choice.repository';
import { ClassRepository } from '../../quiz/quizzes/repositories/class.repository';
import { QuizRepository } from '../../quiz/quizzes/repositories/quiz.repository';
import { RedisService } from '../../../config/database/redis/redis.service';

@Injectable()
export class GameService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly quizRepository: QuizRepository,
    private readonly choiceRepository: ChoiceRepository,
    private readonly redisService: RedisService,
  ) {}

  async cachingQuizData(classId: number) {
    const classWithRelations = await this.classRepository.findClassWithRelations(classId);

    return classWithRelations;
  }

  async checkPinCode(pinCode: string) {
    try {
      const result = await this.redisService.get(`gameId=${pinCode}`);

      if (result) {
        return { isExist: true, message: 'pinCode exists.' };
      }
      return { isExist: false, message: 'pinCode not exists.' };
    } catch (error) {
      console.error('error: ', error);
    }
  }
}
