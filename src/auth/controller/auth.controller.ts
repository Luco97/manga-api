import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createUserDto, loginUserDto } from '@auth/dto';
import { AuthService } from 'auth/services/auth.service';
import { response, userResponse } from '@interface/authResponses.interface';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('sign')
  async sign(
    @Req() req: Request,
    @Body() createUser: createUserDto,
    @Res() res: Response<response>,
  ) {
    try {
      const domain: string = `${req.protocol}://${req.get('host')}`;
      const foo: response = await this._authService.signUser({
        createUser,
        domain,
      });
      return res.status(foo.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error en el servidor',
      });
    }
  }

  @Post('login')
  async login(@Body() login: loginUserDto, @Res() res: Response<userResponse>) {
    try {
      const foo: response = await this._authService.loginUser(login);
      return res.status(foo.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error en el servidor',
      });
    }
  }

  @Get('email-verify/:guid')
  async confirm(@Param('guid') id: string, @Res() res: Response<response>) {
    try {
      const foo: response = await this._authService.emailConfirm(id);
      return res.status(foo.status).json(foo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error en el servidor',
      });
    }
  }
}
