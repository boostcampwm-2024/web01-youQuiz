import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database/mysql.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { redisConfig } from './config/database/redis.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // TypeORM 설정
    TypeOrmModule.forRoot(databaseConfig),
    
    // Redis 설정
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: redisConfig.host,
        port: redisConfig.port,
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}