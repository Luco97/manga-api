import { Controller, Get, Res, HttpStatus, UseGuards, Param, ParseIntPipe, Post, Body, Put } from '@nestjs/common';
import { Response } from 'express';
import { Artist, response } from '@interface/mangaResponses.interface';
import { ArtistService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';
import { createArtistDto, updateArtistsDto } from '@manga/dto';

@Controller('artist')
@UseGuards(AuthGuard)
export class ArtistController {

    constructor(
        private _artistService: ArtistService
    ) {}

    @Get()
    async getAll(
        @Res() res: Response<{response: response, data?: Artist[]}>
    ) {
        try {
            const foo: {response: response, data?: Artist[]} = await this._artistService.getAll();
            return res.status(foo.response.status)
                        .json(foo);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            response:{
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: 'Error en el servidor'
                            }
                        })
        }
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number, 
        @Res() res: Response<{response: response, data?: Artist}>
    ) {
        try {
            const foo: {response: response, data?: Artist} = await this._artistService.getOne(id, []);
            return res.status(foo.response.status)
                        .json(foo);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            response:{
                                status: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: 'Error en el servidor'
                            }
                        })
        }
    }

    @Post()
    async create(
        @Body() createArtist: createArtistDto,
        @Res() res: Response<{response: response, data?: Artist}>
    ) {
        try {
            const foo: {response: response, data?: Artist} = await this._artistService.create(createArtist);
            return res.status(foo.response.status)
                        .json(foo);
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

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateArtist: updateArtistsDto,
        @Res() res: Response<{ response: response, data?: Artist }>
    ) {
        try {
            const foo: {response: response, data?: Artist} = await this._artistService.update(id, updateArtist);
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
