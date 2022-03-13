import {
  Controller,
  Res,
  HttpStatus,
  UseGuards,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { Artist, response } from '@interface/mangaResponses.interface';
import { ArtistService } from '@manga/services';
import {
  createArtistDto,
  readArtistDto,
  readArtist_getMangasDto,
  updateArtistsDto,
} from '@manga/dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('artist')
@UseGuards(AuthGuard)
export class ArtistController {
  constructor(private _artistService: ArtistService) {}

  @Post()
  async getAll(
    @Body() bodyArtists: readArtistDto,
    @Res() res: Response<{ response: response; data?: Artist[] }>,
  ) {
    try {
      const foo: { response: response; data?: Artist[] } =
        await this._artistService.getAll(bodyArtists);
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

  @Post('create')
  async create(
    @Body() createArtist: createArtistDto,
    @Res() res: Response<{ response: response; data?: Artist }>,
  ) {
    try {
      const foo: { response: response; data?: Artist } =
        await this._artistService.create(createArtist);
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

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArtist: updateArtistsDto,
    @Res() res: Response<{ response: response; data?: Artist }>,
  ) {
    try {
      const foo: { response: response; data?: Artist } =
        await this._artistService.update(id, updateArtist);
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

  @Delete('delete/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<{ response: response; data?: Artist }>,
  ) {
    try {
      const foo: { response: response; data?: Artist } =
        await this._artistService.delete(id);
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
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() readArtist: readArtistDto,
    @Res() res: Response<{ response: response; data?: Artist }>,
  ) {
    try {
      const foo: { response: response; data?: Artist } =
        await this._artistService.getOne(id, readArtist.relations);
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
  async getMangasOfArtist(
    @Body() bodyArtists: readArtist_getMangasDto,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<{ response: response; data?: Artist }>,
  ) {
    try {
      const foo: { response: response; data?: Artist } =
        await this._artistService.getArtistMangas(id, bodyArtists);
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
