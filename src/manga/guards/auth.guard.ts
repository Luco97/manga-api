import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@Shared/services/jwt.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private JWTservice: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token: string | string[] = request.headers?.token;

    return this.JWTservice.validateJWT( token as string);
    
  }
}
