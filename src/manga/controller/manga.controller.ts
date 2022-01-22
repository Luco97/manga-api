import { Controller, UseGuards, Get, Res, HttpStatus, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { Response } from 'express';
import { Manga, response } from '@interface/mangaResponses.interface';
import { readMangaDto } from '@manga/dto';
import { MangaService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';

@Controller('manga')
@UseGuards(AuthGuard)
export class MangaController {
  constructor(private _mangaService: MangaService) {}

  @Get()
  async allManga(@Res() res: Response<{response: response, data?: Manga[]}>) {
    try {
        const foo: {response: response, data: Manga[]} = await this._mangaService.getAll();
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

  @Post(':id')
  async oneMangaById(
    @Param('id', ParseIntPipe) id: number,
    @Body() readManga: readMangaDto,
    @Res() res: Response<{response: response, data?: Manga}>
  ) {
    try {
      const foo: {response: response, data?: Manga} = await this._mangaService.getOne(id, readManga);
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
