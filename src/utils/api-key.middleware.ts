import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // const isHaveApiKey = req.headers.api_key;
    // console.log(req.method, req.baseUrl, req.body);
    // if (isHaveApiKey == process.env.API_KEY) next();
    next();
  }
}
