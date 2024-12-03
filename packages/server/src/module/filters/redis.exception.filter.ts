import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RedisException } from 'src/module/exceptions/redis.exception';

@Catch(RedisException)
export class RedisExceptionFilter implements ExceptionFilter {
  catch(exception: RedisException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const type = host.getType();

    const statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: statusCode,
      message: exception.message || 'Redis Error',
      timestamp: new Date().toISOString(),
      path: type === 'http' ? request.url : undefined,
    };

    if (type === 'http') {
      response.status(statusCode).json(errorResponse);
    } else if (type === 'ws') {
      const client = host.switchToWs().getClient();
      client.emit('error', errorResponse);
    }
  }
}
