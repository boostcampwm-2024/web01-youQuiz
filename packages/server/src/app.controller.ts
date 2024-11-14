import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './config/database/redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    console.log('getHello');
    this.redisService.set('hi', 'hello');
    return this.appService.getHello();
  }
}
