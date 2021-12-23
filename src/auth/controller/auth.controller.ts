import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createUserDto, loginUserDto } from '@auth/dto';
import { AuthService } from 'auth/services/auth.service';
import { response, userResponse } from '@interface/authResponses.interface';

@Controller('auth')
export class AuthController {

    constructor(
        private _authService: AuthService
    ) {}

    @Post('sign')
    async sign(
        @Body() createUser: createUserDto,
        @Res() res: Response<response>
    ) {
        try {
            const foo: response = await this._authService.signUser(createUser);
            return res.status(foo.status).json(foo);

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            message: 'Error en el servidor'
                        })
        }
    }

    @Post('login')
    async login( 
        @Body() login: loginUserDto,
        @Res() res: Response<userResponse>
    ) {
        try {
            const foo: response = await this._authService.loginUser(login);
            return res.status(foo.status).json(foo);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            message: 'Error en el servidor'
                        })
        }
    }

    @Post('logout')
    async logout(
        @Body() login: loginUserDto,
        @Res() res: Response<response>
    ) {
        try {
            const foo: response = await this._authService.logoutUser(login);
            return res.status(foo.status).json(foo);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            message: 'Error en el servidor'
                        })

        }
    }
}
