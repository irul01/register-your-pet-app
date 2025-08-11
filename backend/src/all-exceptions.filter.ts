// backend/src/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import type { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 강력 로그
    // eslint-disable-next-line no-console
    console.error('[EXC]', {
      path: req.url,
      method: req.method,
      message: exception?.message,
      name: exception?.name,
      stack: exception?.stack,
    });

    res.status(status).json({
      message: exception?.message || 'Internal Server Error',
    });
  }
}
