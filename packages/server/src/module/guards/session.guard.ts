import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisService } from '../../config/database/redis/redis.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();

    const { sid } = client.handshake.auth;

    console.log('sid', sid);

    if (!sid) {
      client.emit('error', { message: 'Session ID not exists in Cookie.' });
      return false;
    }

    if (
      !(
        (await this.redisService.exists(`master_sid=${sid}`)) ||
        (await this.redisService.exists(`participant_sid=${sid}`))
      )
    ) {
      client.emit('error', { message: 'Session ID not exists in Redis.' });
    }

    return true;
  }
}
