import { MangaEntity } from '@db/manga/entity';
import { response, User } from '@interface/mangaResponses.interface';
import { getFavorite, setFavorite } from '@manga/dto';
import { Injectable, HttpStatus } from '@nestjs/common';
import { UserEntity } from '@db/user/entity';
import { UserEntityService } from '@db/user/service';
import { MangaEntityService } from '@db/manga/services';

@Injectable()
export class UserService {

    constructor(
        private _userService: UserEntityService,
        private _mangaService: MangaEntityService
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

    async getFavorites( getFavoritesBody: getFavorite): Promise<{response: response, data?: User}> {

        const { take, skip, user } = getFavoritesBody;
        const mangas: MangaEntity[] = await this._mangaService.getFavoritesById( user.id, take, skip);
        const { data }: { response: response, data?: User; } = await this.getOne( user.id, []);
        
        if(data) {
            data.mangas = mangas;
            return {
                response: {
                    status: 200,
                    message: 'getFavorites'
                },
                data: {
                    ...data
                }
            }
        }
        return {
            response: {
                status: HttpStatus.NOT_FOUND,
                message: 'Error dentro del metodo getFavorites'
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
                user.mangas.splice( data.data.mangas.indexOf(manga), 1);
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
