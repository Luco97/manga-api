import { Body, Controller, Post } from '@nestjs/common';
import { Login } from '@manga/clases/login';

@Controller('auth')
export class AuthController {
    @Post('login')
    login( @Body()login: Login) {

    }
}
