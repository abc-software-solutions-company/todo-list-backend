import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception);
    
    console.log(JSON.stringify(exception.status));
    response.status(exception.status).json({
      statusCode: exception.status,
      message: 'Bad Request',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
