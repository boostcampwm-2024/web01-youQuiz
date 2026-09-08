import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import Joi from 'joi';
import databaseConfig from './configuration';
import { MysqlConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // cwd에 의존하지 않도록 이 파일 위치(src/config/database/mysql 또는
      // dist/config/database/mysql) 기준 상대경로로 packages/server/.env를 찾는다.
      envFilePath: join(__dirname, '../../../../.env'),
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
      }),
    }),
  ],
  providers: [MysqlConfigService],
  exports: [MysqlConfigService],
})
export class MysqlConfigModule {}
