import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ResponseDto<T> {
  @Expose()
  statusCode: number;

  @Expose()
  message: string;

  @Expose()
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
