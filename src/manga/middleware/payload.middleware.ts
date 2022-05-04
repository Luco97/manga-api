import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@shared/services';
import { Request, Response } from 'express';

@Injectable()
export class PayloadMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: () => void) {
    const user = this.jwtService.getObjectJWT(
      req.headers.authorization?.replace('Bearer ', ''),
    );
    if (user?.id && user?.username) req.body.user = user;
    next();
  }
}
