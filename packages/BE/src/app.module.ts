import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { redisConfig } from './config/redis.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // TypeORM 설정
    TypeOrmModule.forRoot(databaseConfig),
    
    // Redis 설정
    RedisModule.forRoot({
      type: 'single',  // Redis 연결 타입 지정
      options: {       // 실제 연결 설정
        host: redisConfig.host,
        port: redisConfig.port,
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}