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
            return (payload.id && payload.username);
        } catch (error) {
            return false;
        }
    }
}
