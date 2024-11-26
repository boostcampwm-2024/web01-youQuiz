import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: string, ex?: 'EX', expireInSeconds?: number) {
    if (expireInSeconds) {
      await this.redis.set(key, value, ex, expireInSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  async zincrby(key: string, increment: number, member: string) {
    await this.redis.zincrby(key, increment, member);
  }

  async zrevrange(key: string, min: number, max: number) {
    return await this.redis.zrevrange(key, min, max, 'WITHSCORES');
  }

  async zrevrank(key: string, member: string) {
    return await this.redis.zrevrank(key, member);
  }

  async zscore(key: string, member: string) {
    return await this.redis.zscore(key, member);
  }
}
