import { HttpException, HttpStatus } from '@nestjs/common';

export class RedisException extends HttpException {
  constructor(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
    this.name = 'RedisException';
  }
}
