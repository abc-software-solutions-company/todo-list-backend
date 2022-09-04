import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception);
    response.status(400).json({
      statusCode: 400,
      message: 'Bad Request',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
