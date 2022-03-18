import { Injectable, NestMiddleware, Body } from '@nestjs/common';
import { JwtService } from '@shared/services';
import { Request, Response } from 'express';

@Injectable()
export class PayloadMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: () => void) {
    req.body = {
      user: this.jwtService.getObjectJWT(
        req.headers.authorization?.replace('Bearer ', ''),
      ),
      ...req.body,
    };
    next();
  }
}
