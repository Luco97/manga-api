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
  Query,
  UseInterceptors,
  UploadedFiles,
  Put,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  CommentDto,
  createMangaDto,
  readMangaDto,
  updateMangaDto,
  utilCommentDto,
} from '@manga/dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  Commentary,
  Manga,
  response,
} from '@interface/mangaResponses.interface';
import { CloudinaryService } from '@shared/services';
import { unlink } from 'fs';
import { RoleGuard } from '../guards/role.guard';
import { MangaService } from '../services/manga.service';
import { CommentService } from '../services/comment.service';
import { map } from 'rxjs';

@Controller('manga')
export class MangaController {
  constructor(
    private _mangaService: MangaService,
    private _commentService: CommentService,
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

  @UseGuards(AuthGuard, RoleGuard)
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

  @UseGuards(AuthGuard, RoleGuard)
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

  @UseGuards(AuthGuard, RoleGuard)
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

  @Post(':id')
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

  @UseGuards(AuthGuard, RoleGuard)
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

  @Post('comment/:manga_id')
  getComments(
    @Body() req: utilCommentDto,
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number,
    @Param('manga_id', ParseIntPipe) id: number,
    @Res()
    res: Response<{
      response: response;
      data?: {
        comments: Commentary[];
        count: number;
      };
    }>,
  ) {
    try {
      const user_id = req.user?.id;
      this._commentService
        .getCommentsByManga({ manga_id: id, take, skip })
        .pipe(
          map((rainingBlood) => {
            if (user_id)
              rainingBlood.data.comments.forEach((element) => {
                element.user.id == user_id ? (element.isCommentUser = true) : 0;
              });
            return rainingBlood;
          }),
        )
        .subscribe((foo) => res.status(foo.response.status).json(foo));
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
  @Put('comment/:manga_id')
  commentManga(
    @Body()
    userComment: CommentDto,
    @Param('manga_id', ParseIntPipe) id: number,
    @Res()
    res: Response<{
      response: response;
      comment?: Commentary;
    }>,
  ) {
    try {
      this._commentService
        .postComment({
          manga_id: id,
          user_id: userComment.user.id,
          comment: userComment.comment,
        })
        .subscribe((foo) => res.status(foo.response.status).json(foo));
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
  @Delete('comment/:manga_id/:comment_id')
  deleteComment(
    @Headers('authorization') token: string,
    @Param('manga_id', ParseIntPipe) manga_id: number,
    @Param('comment_id') comment_id: number,
    @Res() res: Response<{ response: response }>,
  ) {
    try {
      //logica para borrar
      this._commentService
        .delete({
          token,
          manga_id,
          comment_id,
        })
        .subscribe((data) => {
          res.status(data.response.status).json(data);
        });
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
