import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  ParseIntPipe,
  Body,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { Language, response } from '@interface/mangaResponses.interface';
import { createLanguageDto, readLanguageDto } from '@manga/dto';
import { LanguageService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('language')
export class LanguageController {
  constructor(private _languageService: LanguageService) {}

  @Get()
  getAll(@Res() res: Response<{ response: response; data?: Language[] }>) {
    try {
      this._languageService
        .getAll()
        .subscribe((foo: { response: response; data?: Language[] }) =>
          res.status(foo.response.status).json(foo),
        );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
        },
      });
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Post('create')
  create(
    @Body() createLanguage: createLanguageDto,
    @Res() res: Response<{ response: response; data?: Language }>,
  ) {
    try {
      this._languageService
        .create(createLanguage)
        .subscribe((foo: { response: response; data?: Language }) =>
          res.status(foo.response.status).json(foo),
        );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
        },
      });
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete('delete/:id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<{ response: response; data?: Language }>,
  ) {
    try {
      this._languageService
        .delete(id)
        .subscribe((foo: { response: response; data?: Language }) =>
          res.status(foo.response.status).json(foo),
        );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
        },
      });
    }
  }

  @Post(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() readLanguage: readLanguageDto,
    @Res() res: Response<{ response: response; data?: Language }>,
  ) {
    try {
      this._languageService
        .getOne(id, readLanguage.relations)
        .subscribe((foo: { response: response; data?: Language }) =>
          res.status(foo.response.status).json(foo),
        );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error en el servidor',
        },
      });
    }
  }
}
