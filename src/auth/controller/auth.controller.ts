import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FindOneOptions } from 'typeorm';
import { createUserDto, loginUserDto } from '@user/dto';
import { UserService } from '@userDB/service';
import { UserEntity } from '@userDB/entity';
import { compare } from 'bcrypt';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService
    ) {}

    @Post('sign')
    async sign(
        @Body() createUser: createUserDto,
        @Res() res: Response
    ) {
        try {
            const users: UserEntity[] = await this.userService.findBy({
                where: [
                    {username:  createUser.username},
                    {email:     createUser.email}
                ]
            } as FindOneOptions<UserEntity>)

            if(users.length) {
                return res.status(HttpStatus.CONFLICT)
                            .json({
                                status: HttpStatus.CONFLICT,
                                message: 'Ya existe'
                            })
            }
            const newUser: UserEntity = new UserEntity(createUser.username, createUser.email, createUser.password);
            this.userService.create(newUser);
            return res.status(HttpStatus.CREATED)
                        .json({
                            status: HttpStatus.CREATED,
                            message: 'Usuario creado con exito !'
                        })

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            message: 'Error en el servidor'
                        })
        }
    }

    @Post('login')
    async login( 
        @Body() login: loginUserDto,
        @Res() res: Response
    ) {
        try {
            const users: UserEntity[] = await this.userService.findBy({
                where:{
                    email: login.email
                }
            });
            const user: UserEntity = users.pop()
            if(user) {
                const passCompare: boolean = await compare(login.password, user.password);
                if(passCompare) {
                    return res.status(HttpStatus.OK)
                                .json({
                                    status: HttpStatus.OK,
                                    message: `Bienvenido ${user.username}`,
                                })
                }
                return res.status(HttpStatus.OK)
                            .json({
                                status: HttpStatus.OK,
                                message: 'Datos invalidos'
                            })
            }
            return res.status(HttpStatus.NOT_FOUND)
                        .json({
                            status: HttpStatus.NOT_FOUND,
                            message: 'Datos invalidos (El usuario no existe)'
                        })

            const user2: UserEntity = await this.userService.findOneByMail(login.email);
            const user3: UserEntity = await this.userService.findOneByMail2(login.email);
            
            return res.status(HttpStatus.OK)
                        .json({
                            users,
                            user2,
                            user3
                        });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json()
        }
    }
}
