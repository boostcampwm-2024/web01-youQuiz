import { Injectable } from '@nestjs/common';
import { ChoiceRepository } from '../../quiz/quizzes/repositories/choice.repository';
import { ClassRepository } from '../../quiz/quizzes/repositories/class.repository';
import { QuizRepository } from '../../quiz/quizzes/repositories/quiz.repository';
import { RedisService } from '../../../config/database/redis/redis.service';
import { Quiz } from 'src/module/quiz/quizzes/entities/quiz.entity';
// import { RANK_THREE } from '@shared/constants/game.constants';

@Injectable()
export class GameService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly quizRepository: QuizRepository,
    private readonly choiceRepository: ChoiceRepository,
    private readonly redisService: RedisService,
  ) {}

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

  async checkSidType(sid: string) {
    try {
      const keyIds = ['master', 'participant'];

      for (const keyId of keyIds) {
        if (await this.redisService.get(`${keyId}_sid=${sid}`)) {
          return { type: keyId };
        }
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }
}
