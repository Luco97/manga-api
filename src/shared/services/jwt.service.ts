import { Injectable } from '@nestjs/common';
import { JwtService as JWTservice } from '@nestjs/jwt';

@Injectable()
export class JwtService {

    constructor( private JWT: JWTservice) {}

    generateJWT( user_id: number, username: string): string {
        const value = this.JWT.sign({
            id: user_id,
            username
        })
        console.log(value);
        return 'token'
    }
    validateJWT( token: string ): boolean {
        if(token) {
            this.generateJWT( 24, 'Comepingas');
            return true;
        }
        return false;
    }
}
