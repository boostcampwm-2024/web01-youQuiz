import { Injectable } from '@nestjs/common';
import { ClassRepository } from '../../quiz/quizzes/repositories/class.repository';
import { RedisService } from '../../../config/database/redis/redis.service';
import { Quiz } from 'src/module/quiz/quizzes/entities/quiz.entity';
import { PARTICIPANT_MAX_NUMBER } from '@shared/constants/game.constants';
import { RedisException } from 'src/module/errors/redis.exception';

@Injectable()
export class GameService {
  constructor(
    private readonly classRepository: ClassRepository,
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
    const result = await this.redisService.get(`gameId=${pinCode}`);

    if (result) {
      return { isExist: true, message: 'pinCode exists.' };
    }
    return { isExist: false, message: 'pinCode not exists.' };
  }

  async checkSidType(sid: string) {
    const keyIds = ['master', 'participant'];

    for (const keyId of keyIds) {
      const result = await this.redisService.get(`${keyId}_sid=${sid}`);

      if (result) {
        return { type: keyId };
      }
    }

    throw new RedisException(`Key Error: any_sid=${sid} not exists in Redis`);
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

  async checkAccumulation(pinCode: string) {
    const result = await this.redisService.get(`gameId=${pinCode}`);

    if (!result) {
      throw new RedisException(`Key Error: gameId=${pinCode} not exists in Redis`);
    }

    const gameInfo = JSON.parse(result);
    const participantLength = gameInfo.participantList.length;

    const isPossible = participantLength >= PARTICIPANT_MAX_NUMBER ? false : true;
    return { isPossible };
  }

  async checkGameStatus(sid: string, pinCode: string) {
    const participantData = await this.redisService.get(`participant_sid=${sid}`);
    if (!participantData) {
      throw new RedisException(`Key Error: participant_sid=${sid} not exists in Redis`);
    }

    const gameData = await this.redisService.get(`gameId=${pinCode}`);
    if (!gameData) {
      throw new RedisException(`Key Error: gameId=${pinCode} not exists in Redis`);
    }

    const { pinCode: joinedPinCode } = JSON.parse(participantData);
    if (joinedPinCode !== pinCode) {
      return { isPossible: false, gameStatus: null };
    }

    const { gameStatus } = JSON.parse(gameData);
    return { isPossible: true, gameStatus };
  }

  async checkIsProgressed(pinCode: string) {
    const result = await this.redisService.get(`gameId=${pinCode}`);
    if (!result) {
      throw new RedisException(`Key Error: gameId=${pinCode} not exists in Redis`);
    }

    const { gameStatus } = JSON.parse(result);
    return {
      isPossible: true,
      isProgressed: gameStatus === 'IN PROGRESS' || gameStatus === 'END',
    };
  }
}
