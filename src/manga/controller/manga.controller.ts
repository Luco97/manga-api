import { Controller, UseGuards, Res, HttpStatus, Post, Param, ParseIntPipe, Body, Delete, Put } from '@nestjs/common';
import { Response } from 'express';
import { Manga, response } from '@interface/mangaResponses.interface';
import { createMangaDto, readMangaDto, updateMangaDto } from '@manga/dto';
import { MangaService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';

@Controller('manga')
@UseGuards(AuthGuard)
export class MangaController {
  constructor(private _mangaService: MangaService) {}

  @Post()
  async allManga(
    @Body() bodyMangas: readMangaDto,
    @Res() res: Response<{response: response, data?: Manga[]}>
  ) {
    try {
        const foo: {response: response, data: Manga[]} = await this._mangaService.getAll(bodyMangas);
        return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({
                    response: {
                      status: HttpStatus.INTERNAL_SERVER_ERROR,
                      message: 'Error en el servidor'
                    }
                  });
    }
  }

  @Post('create')
  async createManga(
    @Body() createManga: createMangaDto,
    @Res() res: Response<{response: response, data?: Manga}>
  ) {
    try {
      const foo: {response: response, data?: Manga} = await this._mangaService.create(createManga);
      return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({
                    response: {
                      status: HttpStatus.INTERNAL_SERVER_ERROR,
                      message: 'Error en el servidor'
                    }
                  });
    }
  }

  @Post('update/:id')
  async updateManga (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManga: updateMangaDto,
    @Res() res: Response<{response: response, newData?: Manga, oldData?: Manga}>
  ) {
    try {
      const foo: {response: response, newData?: Manga, oldData?: Manga} = await this._mangaService.updateMangaContent(id, updateManga);
      return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({
                    response: {
                      status: HttpStatus.INTERNAL_SERVER_ERROR,
                      message: 'Error en el servidor'
                    }
                  });
    }
  }

  @Delete('delete/:id')
  async delete (
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<{response: response, data?: Manga}>
  ) {
    try {
      const foo: {response: response, data?: Manga} = await this._mangaService.delete(id);
      return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({
                    response: {
                      status: HttpStatus.INTERNAL_SERVER_ERROR,
                      message: 'Error en el servidor'
                    }
                  });
    }
  }

  @Put(':id')
  async oneMangaById(
    @Param('id', ParseIntPipe) id: number,
    @Body() readManga: readMangaDto,
    @Res() res: Response<{response: response, data?: Manga}>
  ) {
    try {
      const foo: {response: response, data?: Manga} = await this._mangaService.getOne(id, readManga.relations);
      return res.status(foo.response.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({
                    response: {
                      status: HttpStatus.INTERNAL_SERVER_ERROR,
                      message: 'Error en el servidor'
                    }
                  });
    }
  }
}
