import { Injectable, NestMiddleware, Body } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RelationsMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    if(!req.body?.relations) {
      req.body = {
        ...req.body,
        relations: []
      }
    }
    next();
  }
}
