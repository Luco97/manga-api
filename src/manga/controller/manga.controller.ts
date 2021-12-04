import { Controller, UseGuards, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';

@Controller('manga')
@UseGuards(AuthGuard)
export class MangaController {
    constructor( ) {}
    /* @Get('x')
    getManga(@Res() res: Response) {
        res.status(HttpStatus.OK)
            .json({
                message: 'Everithing works fine !!!'
            })
    } */
}
