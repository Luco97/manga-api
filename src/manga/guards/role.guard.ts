import { RoleEntityService } from '@db/user/service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@shared/services';
import { Request } from 'express';
import { from, Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private _jwtService: JwtService,
    private _roleService: RoleEntityService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string = request.headers.authorization?.replace(
      /Bearer /g,
      '',
    );
    const user = this._jwtService.getObjectJWT(token);
    return from(this._roleService.find(user?.id));
  }
}
