export class RedisException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RedisException';
  }
}
