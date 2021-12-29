import { Controller, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Artist, response } from '@interface/mangaResponses.interface';
import { ArtistService } from '@manga/services';
import { AuthGuard } from '../guards/auth.guard';

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
}
