import { Language, response } from '@interface/mangaResponses.interface';
import { createLanguageDto, readLanguageDto } from '@manga/dto';
import { LanguageService } from '@manga/services';
import { Controller, Get, HttpStatus, Param, Post, Res, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('language')
export class LanguageController {

    constructor(
        private _languageService: LanguageService
    ) {}

    @Get()
    async getAll(
        @Res() res: Response<{response: response, data?: Language[]}>
    ) {
        try {
            const foo: {response: response, data?: Language[]} = await this._languageService.getAll();
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
    async getOne(
        @Param('id',ParseIntPipe) id: number,
        @Body() readLanguage: readLanguageDto,
        @Res() res: Response<{response: response, data?: Language}>
    ) {
        try {
            const foo: {response: response, data?: Language} = await this._languageService.getOne(id, readLanguage.relations);
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

    @Post()
    async create(
        @Body() createLanguage: createLanguageDto,
        @Res() res: Response<{response: response, data?: Language}>
    ) {
        try {
            const foo: {response: response, data?: Language} = await this._languageService.create(createLanguage);
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

