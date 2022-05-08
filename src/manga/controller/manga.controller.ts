import {
  Controller,
  UseGuards,
  Res,
  HttpStatus,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createMangaDto, readMangaDto, updateMangaDto } from '@manga/dto';
import { MangaService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';
import { Manga, response } from '@interface/mangaResponses.interface';
import { CloudinaryService } from '@shared/services';
import { unlink } from 'fs';

@Controller('manga')
export class MangaController {
  constructor(
    private _mangaService: MangaService,
    private _cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  async allManga(
    @Body() bodyMangas: readMangaDto,
    @Query('name') name: string,
    @Res() res: Response<{ response: response; data?: Manga[] }>,
  ) {
    try {
      const foo: { response: response; data: Manga[] } =
        await this._mangaService.getAll(bodyMangas, name);
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
  @Post('create')
  async createManga(
    @Body() createManga: createMangaDto,
    @Res() res: Response<{ response: response; data?: Manga }>,
  ) {
    try {
      const foo: { response: response; data?: Manga } =
        await this._mangaService.create(createManga);
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
  @Post('update/:id')
  async updateManga(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManga: updateMangaDto,
    @Res()
    res: Response<{ response: response; newData?: Manga; oldData?: Manga }>,
  ) {
    try {
      const foo: { response: response; newData?: Manga; oldData?: Manga } =
        await this._mangaService.updateMangaContent(id, updateManga);
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
  @Delete('delete/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<{ response: response; data?: Manga }>,
  ) {
    try {
      const foo: { response: response; data?: Manga } =
        await this._mangaService.delete(id);
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
  async oneMangaById(
    @Param('id', ParseIntPipe) id: number,
    @Body() readManga: readMangaDto,
    @Res() res: Response<{ response: response; data?: Manga }>,
  ) {
    try {
      const foo: { response: response; data?: Manga } =
        await this._mangaService.getOne(id, readManga.relations);
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
  @Post('manga_pages/:manga_name')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: './archives/mangas',
        filename: (req, file, cb) => cb(null, file.originalname),
      }),
    }),
  )
  async uploadImages(
    @Param('manga_name') manga_name: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Res()
    res: Response<{
      response: response;
      data?: { result?: any; error?: any }[];
    }>,
  ) {
    try {
      const promiseArray: Promise<{ result?: any; error?: any }>[] = [];
      files.forEach((element, index) => {
        promiseArray.push(
          this._cloudinaryService.upload(
            element.path,
            `mangas/${manga_name}`,
            `${index + 1}`,
          ),
        );
      });
      const resolveArray: { result?: any; error?: any }[] = await Promise.all(
        promiseArray,
      );
      if (resolveArray.length) {
        files.forEach((element) => {
          unlink(element.path, (error) => {});
        });
        return res.json({
          response: {
            status: HttpStatus.CREATED,
            message: 'Imagenes en cloudinary',
          },
          data: resolveArray,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
          error,
        },
      });
    }
  }
}
