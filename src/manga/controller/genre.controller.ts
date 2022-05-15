import {
  Controller,
  Res,
  UseGuards,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { Genre, response } from '@interface/mangaResponses.interface';
import {
  createGenreDto,
  readGenreDto,
  readGenre_getMangasDto,
} from '@manga/dto';
import { GenreService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('genre')
export class GenreController {
  constructor(private _genreService: GenreService) {}

  @Post()
  async getAll(
    @Body() readGenres: readGenreDto,
    @Res() res: Response<{ response: response; data?: Genre[] }>,
  ) {
    try {
      const foo: { response: response; data?: Genre[] } =
        await this._genreService.getAll(readGenres);
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

  @UseGuards(AuthGuard, RoleGuard)
  @Post('create')
  async create(
    @Body() createGenre: createGenreDto,
    @Res() res: Response<{ response: response; data?: Genre }>,
  ) {
    try {
      const foo: { response: response; data?: Genre } =
        await this._genreService.create(createGenre);
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

  @UseGuards(AuthGuard, RoleGuard)
  @Delete('delete/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<{ response: response; data?: Genre }>,
  ) {
    try {
      const foo: { response: response; data?: Genre } =
        await this._genreService.delete(id);
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

  @Post(':id/mangas')
  async getMangasOfGenre(
    @Param('id', ParseIntPipe) id: number,
    @Body() readGenre: readGenre_getMangasDto,
    @Res() res: Response<{ response: response; data?: Genre }>,
  ) {
    try {
      const foo: { response: response; data?: Genre } =
        await this._genreService.getOne(id, readGenre.relations);
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

  @Put(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() readGenre: readGenreDto,
    @Res() res: Response<{ response: response; data?: Genre }>,
  ) {
    try {
      const foo: { response: response; data?: Genre } =
        await this._genreService.getOne(id, readGenre.relations);
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
