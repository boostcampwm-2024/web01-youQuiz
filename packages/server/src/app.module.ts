import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlConfigModule } from './config/database/mysql/configuration.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { QuizModule } from './module/quiz/quiz.module';
import { GameGateway } from './module/game/game.gateway';
import { RedisService } from './config/database/redis/redis.service';
import { RedisModule } from '@nestjs-modules/ioredis'; // 추가
import { GameService } from './module/game/games/game.service';
@Module({
  imports: [
    UserModule,
    QuizModule,
    MysqlConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'mysql',
        host: configService.get<string>('mysql.host'),
        port: configService.get<number>('mysql.port'),
        username: configService.get<string>('mysql.user'),
        password: configService.get<string>('mysql.password'),
        database: configService.get<string>('mysql.database'),
        entities: [__dirname + '/../**/*.entity.ts'],
        synchronize: configService.get<boolean>('mysql.synchronize'),
        autoLoadEntities: configService.get<boolean>('mysql.autoLoadEntities'),
      }),
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway, RedisService, GameService],
  exports: [RedisService],
})
export class AppModule {}
