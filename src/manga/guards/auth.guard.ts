import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@shared/services';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private JWTservice: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest();
    const token: string | string[] = request.headers.authorization?.replace('Bearer ', '');
    return this.JWTservice.validateJWT( token as string);
    
  }
}
