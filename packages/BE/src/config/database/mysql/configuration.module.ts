import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import databaseConfig from './configuration';
import { MysqlConfigService } from './configuration.service';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
        envFilePath: './packages/BE/.env',
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
