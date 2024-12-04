import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RedisException } from '../errors/redis.exception';
import { Socket } from 'socket.io';

@Catch(RedisException)
export class RedisWsExceptionFilter implements ExceptionFilter {
  catch(exception: RedisException, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient<Socket>();
    client.emit('error', {
      message: exception.message,
      error: exception.name,
    });
  }
}
