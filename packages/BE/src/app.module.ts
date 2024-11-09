import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { redisConfig } from './config/database/redis/redis.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlConfigModule } from './config/database/mysql/configuration.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    UserModule,
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
    // Redis 설정
    // RedisModule.forRoot({
    //   type: 'single',
    //   options: {
    //     host: redisConfig.host,
    //     port: redisConfig.port,
    //   }
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}