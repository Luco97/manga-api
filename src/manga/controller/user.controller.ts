import {
  Controller,
  HttpStatus,
  Res,
  UseGuards,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { Response } from 'express';

import { response, User } from '@interface/mangaResponses.interface';
import { getFavorite, setFavorite } from '@manga/dto';
import { UserService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService /* UserEntityService */) {}

  @UseGuards(AuthGuard)
  @Post('favorites')
  async getFavorites(
    @Body() getBody: getFavorite,
    @Res()
    res: Response<{
      response: response;
      data?: User;
    }>,
  ) {
    try {
      const foo: { response: response; data?: User } =
        await this._userService.getFavorites(getBody);
      return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
        },
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('favorites')
  async favoriteManga(
    //@Param('id', ParseIntPipe) id: number,
    @Body() newFavorite: setFavorite,
    @Res()
    res: Response<{ response: response; data?: User }>,
  ) {
    try {
      const { id } = newFavorite.user;
      const foo: { response: response; data?: User } =
        await this._userService.setFavorite(id, newFavorite);
      return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
        },
      });
    }
  }

  @Put('check')
  async isFavorite(
    @Body() Favorite: setFavorite,
    @Res() res: Response<{ response: response; isFavorite?: boolean }>,
  ) {
    try {
      // console.log('Controlador');
      const { id } = Favorite.user;
      if (!id)
        return res.json({
          response: {
            status: HttpStatus.OK,
            message: 'Usuario no autenticado, no es favorito ni en pedo',
          },
          isFavorite: false,
        });
      const foo: { response: response; isFavorite?: boolean } =
        await this._userService.checkFavorite(Favorite.manga.id, id);
      return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
        },
      });
    }
  }
}
