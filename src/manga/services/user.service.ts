import { MangaEntity } from '@db/manga/entity';
import { response, User } from '@interface/mangaResponses.interface';
import { setFavorite } from '@manga/dto';
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

    async setFavorite(id: number, body: setFavorite): Promise<{response: response, data?: User}> {
        const data: {response: response, data?: User} = await this.getOne(id);
        if(data?.data) {
            const user: UserEntity = data.data as UserEntity;
            const manga = data.data.mangas.find( manga => manga.id == body.manga.id);
            //Manga ya existe como favorito
            if(manga) {
                user.mangas = data.data.mangas.splice(1, 0, manga);
                await this._userService.create(user);
                return {
                    response: {
                        status: HttpStatus.OK,
                        message: `Manga con id = '${body.manga.id}' y titulo = '${body.manga.title}' ya existe, Manga eliminado`
                    },
                    data: user
                };
            }
            user.mangas.push(body.manga as MangaEntity);
            
            try {
                await this._userService.create(user);
            } catch (error) {
                //Manga incorrecto/no existe
                return {
                    response: {
                        status: HttpStatus.BAD_REQUEST,
                        message: `Manga con id = '${body.manga.id}' no existe`
                    }
                };
            }
            return {
                response: {
                    status: HttpStatus.OK,
                    message: 'setFavorite user'
                },
                data: user
            };
        }
        return {
            response: {
                status: HttpStatus.NOT_FOUND,
                message: `No existe un usuario con id = '${id}'`
            }
        }
    }
}
