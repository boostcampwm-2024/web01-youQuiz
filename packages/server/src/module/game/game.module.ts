import { Module } from '@nestjs/common';
import { GameController } from './games/game.controller';
import { GameService } from './games/game.service';
import { GameGateway } from './games/game.gateway';
import { GameGatewayService } from './games/game.gateway.service';
import { QuizModule } from '../quiz/quiz.module';
import { RedisModule } from '../../config/database/redis/redis.module';

@Module({
  imports: [QuizModule, RedisModule],
  controllers: [GameController],
  providers: [GameService, GameGatewayService, GameGateway],
  exports: [GameService, GameGatewayService, GameGateway],
})
export class GameModule {}
