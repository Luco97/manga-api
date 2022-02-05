import { Injectable, HttpStatus } from '@nestjs/common';
import { compare } from 'bcrypt';

import { createUserDto, loginUserDto } from '@auth/dto';
import { UserEntity } from '@userDB/entity';
import { UserEntityService } from '@userDB/service';
import { JwtService } from '@shared/services';
import { response, userResponse } from '@interface/authResponses.interface';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserEntityService,
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

  async loginUser(loginUser: loginUserDto): Promise<userResponse> {
    const users: UserEntity[] = await this._userService.findBy({
      select: [ 'id', 'email', 'username', 'password'],
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
          if(user.active) {
            return {
              status: HttpStatus.CONFLICT,
              message: 'Datos invalidos (El usuario se encuentra actualmente en uso)'
            }
          }
          const token: string = this._jwtService.generateJWT( user.id, user.username);
          user.password = loginUser.password;
          this._userService.updateStatus(user);
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

  async logoutUser(loginUser: loginUserDto): Promise<response> {
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
          if(user.active) {
            user.password = loginUser.password;
            this._userService.updateStatus(user);
            return {
              status: HttpStatus.OK,
              message: 'Sesion cerrada con exito' 
            }
          }
        return {
          status: HttpStatus.CONFLICT,
          message: `Datos invalidos (El usuario se encuentra desconectado)`
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
