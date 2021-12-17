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
        return value;
    }
    validateJWT( token: string ): boolean {
        try {
            const payload = this.JWT.verify( token, {secret: process.env.JWT_SEED})
            console.log('ID: ', payload.id);
            console.log('UserName: ', payload.username)
            return true;
        } catch (error) {
            console.log('Token no valido !');
            return false;
        }
        /* 
        if(token) {
            this.generateJWT( 24, 'Comepingas');
            return true;
        }
        return false; */
    }
}
