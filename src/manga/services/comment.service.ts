import { CommentEntityService } from '@db/manga/services/comment.entity.service';
import { Commentary, response } from '@interface/mangaResponses.interface';
import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@shared/services';
import { Observable } from 'rxjs';

@Injectable()
export class CommentService {
  constructor(
    private _commentService: CommentEntityService,
    private _jwtService: JwtService,
  ) {}

  getCommentsByManga(parameters: {
    manga_id: number;
    take: number;
    skip: number;
  }): Observable<{
    response: response;
    data: { comments: Commentary[]; count: number };
  }> {
    //Agregar logica para saber cuales son propios de un usuario => usar take y skip para aligerar esta idea
    const observer = new Observable<{
      response: response;
      data: { comments: Commentary[]; count: number };
    }>((subscriber) => {
      this._commentService
        .getCommentsByManga(parameters)
        .subscribe(([comments, count]) => {
          subscriber.next({
            response: {
              status: HttpStatus.OK,
              message: 'Todos los comentarios (paginados)',
            },
            data: {
              comments,
              count,
            },
          });
          subscriber.complete();
        });
    });
    return observer;
  }

  postComment(parameters: {
    manga_id: number;
    user_id: number;
    comment: string;
  }): Observable<{ response: response; comment: Commentary }> {
    const observer = new Observable<{
      response: response;
      comment: Commentary;
    }>((subscriber) => {
      this._commentService
        .postComment(parameters)
        .subscribe(({ id, comment, created_at }) => {
          subscriber.next({
            response: {
              status: HttpStatus.ACCEPTED,
              message: 'comentario en manga por X usuario',
            },
            comment: {
              id,
              comment,
              created_at,
            },
          });
          subscriber.complete();
        });
    });
    return observer;
  }

  delete(parameters: {
    token: string;
    manga_id: number;
    comment_id: number;
  }): Observable<{ response: response }> {
    const { manga_id, comment_id, token } = parameters;
    const user: { id?: number; username?: string } =
      this._jwtService.getObjectJWT(token.replace(/Bearer /g, ''));
    const observer = new Observable<{ response: response }>((subscriber) => {
      this._commentService
        .deleteComment({
          user_id: user.id,
          manga_id,
          comment_id,
        })
        .subscribe((data) => {
          if (data.affected)
            subscriber.next({
              response: {
                status: HttpStatus.ACCEPTED,
                message: 'Comentario eliminado',
              },
            });
          else
            subscriber.next({
              response: {
                status: HttpStatus.NOT_ACCEPTABLE,
                message: 'Parametros invalidos',
              },
            });
          subscriber.complete();
        });
    });
    return observer;
  }
}
