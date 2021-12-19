import { Injectable, HttpStatus } from '@nestjs/common';
import { compare } from 'bcrypt';

import { createUserDto, loginUserDto } from '@user/dto';
import { UserEntity } from '@userDB/entity';
import { UserService } from '@userDB/service';
import { JwtService } from '@Shared/services';
import { response } from '@interface';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
  ) {}

  async signUser(createUser: createUserDto): Promise<response> {
    const users: UserEntity[] = await this._userService.findBy({
      where: [{ username: createUser.username }, { email: createUser.email }],
    });

    if (!users.length) {
      const newUser: UserEntity = new UserEntity(
        createUser.username,
        createUser.email,
        createUser.password,
      );
      this._userService.create(newUser);
      return {
        status: HttpStatus.CREATED,
        message: 'Usuraio creado con exito',
      };
    }
    return {
      status: HttpStatus.CONFLICT,
      message: 'Credenciales en uso',
    };
  }

  async loginUser(loginUser: loginUserDto): Promise<response> {
    const users: UserEntity[] = await this._userService.findBy({
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
          const token: string = this._jwtService.generateJWT( user.id, user.username);
        return {
          status: HttpStatus.OK,
          message: `Bienvenido ${user.username}`,
          token
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
