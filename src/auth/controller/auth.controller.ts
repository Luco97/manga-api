import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FindOneOptions } from 'typeorm';
import { createUserDto } from '@user/dto';
import { UserService } from '@userDB/service';
import { UserEntity } from '@userDB/entity';

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
    login( @Body() login) {
        return {x:'This action loggin han existent user'};
    }
}
