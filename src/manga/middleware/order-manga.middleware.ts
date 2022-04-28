import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OrderMangaMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    if (!req.body?.property) req.body.property = 'created_at';

    if (!req.body?.order) req.body.order = 'DESC';
    next();
  }
}
