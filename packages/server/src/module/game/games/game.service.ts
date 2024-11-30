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

  async cachingQuizData(classId: number) {
    const classWithRelations = await this.findClassWithRelations(classId);
    const transformedData = this.transformQuizData(classWithRelations);

    return transformedData;
  }

  async findClassWithRelations(id: number) {
    const classEntity = await this.classRepository.getOnlyQuiz(id);

    return classEntity?.quizzes || [];
  }

  private transformQuizData(quizlists: Quiz[]) {
    const result = [];

    quizlists.forEach((quiz) => {
      const choiceList = [];
      quiz.choices.forEach((choice) => {
        const { id, quizId, content, isCorrect, position } = choice;
        const oneChoice = { id, quizId, content, isCorrect, position }; // 인터페이스로 refactor
        choiceList.push(oneChoice);
      });

      const { id, content, quizType, timeLimit, point, position } = quiz;
      const oneQuiz = { id, content, quizType, timeLimit, point, position, choices: choiceList }; // 인터페이스로 refactor
      result.push(oneQuiz);
    });
    return result;
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

  async getRank(key: string, participantNum: number) {
    const result = await this.redisService.zrevrange(key, 0, participantNum);

    const formattedRank = result
      .map((item, index) => {
        if (index % 2 === 0) {
          return [item, result[index + 1]];
        }
      })
      .filter((item) => item !== undefined);

    return formattedRank;
  }
}
