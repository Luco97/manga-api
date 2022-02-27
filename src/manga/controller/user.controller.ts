import { Controller, HttpStatus, Res, UseGuards, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { Response } from 'express';

import { response, User } from '@interface/mangaResponses.interface';
import { UserEntityService } from '@db/user/service';
import { AuthGuard } from '../guards/auth.guard';
import { getFavorite, setFavorite } from '@manga/dto';
import { UserService } from '@manga/services';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {

    constructor(
        private _userService: UserService /* UserEntityService */,
        private _userEntity: UserEntityService
    ){}

    /* @Get()
    async getAll(
        @Res() res: Response<{response: response, users?: User[]}>
    ) {
        try {
            const data: UserEntity[] = await this._userEntity.findBy({
                select: ['id', 'username'],
                relations: ['mangas']
            });
            return res.status(200).json({
                response: {
                    status: 200,
                    message: 'Probando get all de usuarios, esperando no ver password'
                },
                users: data
            })
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            response: {
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: 'Error en el servidor'
                            }
                        })
        }
    } */

    @Post('favorites')
    async getFavorites(
        @Body() getBody: getFavorite,
        @Res() res: Response<{
            response: response;
            data?: User;
        }>
    ) {
        try {
            const foo: { response: response, data?: User; } = await this._userService.getFavorites(getBody);
            return res.status(foo.response.status).json(foo);   
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            response: {
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: 'Error en el servidor'
                            }
                        })
        }
    }

    @Post(':id')
    async favoriteManga(
        @Param('id', ParseIntPipe) id: number,
        @Body() newFavorite: setFavorite,
        @Res() res: Response<{response: response, data?: User}>
    ) {
        try {
            const foo: {response: response, data?: User} = await this._userService.setFavorite(id, newFavorite);
            return res.status(foo.response.status).json(foo);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            response: {
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: 'Error en el servidor'
                            }
                        })
        }
    }
}
