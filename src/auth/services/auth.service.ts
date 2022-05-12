import { Injectable, HttpStatus } from '@nestjs/common';
import { compare } from 'bcrypt';

import { createUserDto, loginUserDto } from '@auth/dto';
import { UserEntity } from '@db/user/entity';
import { RoleEntityService, UserEntityService } from '@db/user/service';
import { JwtService } from '@shared/services';
import { response, userResponse } from '@interface/authResponses.interface';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserEntityService,
    private _roleService: RoleEntityService,
    private _jwtService: JwtService,
  ) {}

  async signUser(createUser: createUserDto): Promise<response> {
    const users: UserEntity[] = await this._userService.findBy({
      where: [{ username: createUser.username }, { email: createUser.email }],
    });

    if (users.length) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Credenciales en uso',
      };
    }

    const newUser: UserEntity = new UserEntity(
      createUser.username,
      createUser.email,
      createUser.password,
    );
    newUser.role = await this._roleService.getCommon;
    this._userService.create(newUser);
    return {
      status: HttpStatus.CREATED,
      message: 'Usuraio creado con exito',
    };
  }

  async loginUser(loginUser: loginUserDto): Promise<userResponse> {
    const users: UserEntity[] = await this._userService.findBy({
      select: ['id', 'email', 'username', 'password'],
      where: {
        email: loginUser.email,
      },
    });

    const user: UserEntity = users.pop();

    if (user) {
      const passCompare: boolean = await compare(
        loginUser.password,
        user.password,
      );
      if (passCompare) {
        const token: string = this._jwtService.generateJWT(
          user.id,
          user.username,
        );
        user.password = loginUser.password;
        return {
          status: HttpStatus.OK,
          message: `Bienvenido ${user.username}`,
          token,
        };
      }
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Datos invalidos',
      };
    }
    return {
      status: HttpStatus.NOT_FOUND,
      message: 'Datos invalidos (El usuario no existe)',
    };
  }
}
