import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { RedisException } from '../../../module/exceptions/redis.exception';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: string, ex?: 'EX', expireInSeconds?: number) {
    try {
      if (expireInSeconds) {
        await this.redis.set(key, value, ex, expireInSeconds);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      throw new RedisException(`Error: Set redis key: ${key}`);
    }
  }

  async exists(key: string) {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      throw new RedisException(`Error: Exists redis key: ${key}`);
    }
  }

  async get(key: string) {
    try {
      const result = await this.redis.get(key);
      if (!result) {
        throw new RedisException(`Key not found: ${key}`, 404);
      }
      return result;
    } catch (error) {
      throw new RedisException(`Error retrieving Redis key: ${key}`, 500);
    }
  }

  async del(key: string) {
    try {
      await this.redis.del(key);
    } catch (error) {
      throw new RedisException(`Error: Del redis key: ${key}`);
    }
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

  async zcard(key: string) {
    return await this.redis.zcard(key);
  }
}
