import { Injectable } from '@nestjs/common';
import { UserEntityService } from '@userDB/service';

@Injectable()
export class UserService {

    constructor(
        private _userService: UserEntityService
    ) {}
}
