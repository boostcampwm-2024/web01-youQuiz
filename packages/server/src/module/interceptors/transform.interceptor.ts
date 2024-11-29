import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../utils/dto/response.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class TransformInterceptor<T extends object> implements NestInterceptor<T, ResponseDto<T>> {
  constructor(private readonly responseType: Type<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return new ResponseDto(
            context.switchToHttp().getResponse().statusCode,
            this.getResponseMessage(context),
            null,
          );
        }

        const transformedData = plainToInstance(this.responseType, data, {
          excludeExtraneousValues: true,
        });

        const errors = validateSync(transformedData);
        if (errors.length > 0) {
          throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }

        const response = new ResponseDto(
          context.switchToHttp().getResponse().statusCode,
          this.getResponseMessage(context),
          transformedData,
        );

        return plainToInstance(ResponseDto, response);
      }),
    );
  }

  private getResponseMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const resource = request.url.includes('quizzes') ? 'Quiz' : 'Class';
    const action = this.getActionByMethod(request.method);
    return `${resource} ${action} successfully`;
  }

  private getActionByMethod(method: string): string {
    const actions = {
      GET: 'retrieved',
      POST: 'created',
      PATCH: 'updated',
      DELETE: 'deleted',
    };
    return actions[method] || 'processed';
  }
}
