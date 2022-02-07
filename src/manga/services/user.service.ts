import { response, User } from '@interface/mangaResponses.interface';
import { Injectable, HttpStatus } from '@nestjs/common';
import { UserEntity } from '@userDB/entity';
import { UserEntityService } from '@userDB/service';

@Injectable()
export class UserService {

    constructor(
        private _userService: UserEntityService
    ) {} 

    async getOne(id: number, relations: string[] = ['mangas']): Promise<{response: response, data?: User}> {
        const data: UserEntity[] = await this._userService.findBy({
            select: ['id', 'username', 'email'],
            relations,
            where:{
                id
            }
        });
        if(data.length) {
            return {
                response: {
                    status: HttpStatus.OK,
                    message: 'getOne user'
                },
                data: data.pop()
            }
        }
        return {
            response: {
                status: HttpStatus.NOT_FOUND,
                message: `No existe un usuario con id = '${id}'`
            }
        }
    }

    async setFavorite(id: number): Promise<{response: response, data?: User}> {
        const data: {response: response, data?: User} = await this.getOne(id);
        if(data?.data) {
            //Seteando favorito, pensando logica
        }
        return {
            response: {
                status: HttpStatus.NOT_FOUND,
                message: `No existe un usuario con id = '${id}'`
            }
        }
    }
}
