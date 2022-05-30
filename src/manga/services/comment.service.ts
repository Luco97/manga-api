import { CommentEntityService } from '@db/manga/services/comment.entity.service';
import { Commentary, response } from '@interface/mangaResponses.interface';
import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(private _commentService: CommentEntityService) {}

  async getCommentsByManga(parameters: {
    manga_id: number;
    take: number;
    skip: number;
  }): Promise<{
    response: response;
    data: { comments: Commentary[]; count: number };
  }> {
    const [comments, count] = await this._commentService.getCommentsByManga(
      parameters,
    );
    return {
      response: {
        status: HttpStatus.OK,
        message: 'Todos los comentarios (paginados)',
      },
      data: {
        comments,
        count,
      },
    };
  }

  async postComment(parameters: {
    manga_id: number;
    user_id: number;
    comment: string;
  }): Promise<{ response: response; comment: Commentary }> {
    const { id, comment, created_at } = await this._commentService.postComment(
      parameters,
    );
    return {
      response: {
        status: HttpStatus.ACCEPTED,
        message: 'comentario en manga por X usuario',
      },
      comment: {
        id,
        comment,
        created_at,
      },
    };
  }
}
