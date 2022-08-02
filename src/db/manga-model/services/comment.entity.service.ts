import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CommentEntity } from '../entity/comment.entity';
import { from, Observable } from 'rxjs';

@Injectable()
export class CommentEntityService {
  constructor(
    @InjectRepository(CommentEntity)
    private _commentRepository: Repository<CommentEntity>,
  ) {}

  getCommentsByManga(parameters: {
    manga_id: number;
    take: number;
    skip: number;
  }): Observable<[CommentEntity[], number]> {
    const { manga_id, take, skip } = parameters;

    return from(
      this._commentRepository
        .createQueryBuilder('comment')
        .innerJoinAndSelect('comment.user', 'culero')
        .innerJoin('comment.manga', 'manguita', 'manguita.id = :manga_id', {
          manga_id,
        })
        .orderBy('comment.created_at', 'DESC')
        .take(take)
        .skip(skip * take)
        .getManyAndCount(),
    );
  }

  postComment(parameters: {
    manga_id: number;
    user_id: number;
    comment: string;
  }): Observable<CommentEntity> {
    const { manga_id, user_id, comment } = parameters;
    const Comment = this._commentRepository.create({
      manga: { id: manga_id },
      user: { id: user_id },
      comment,
    });
    return from(this._commentRepository.save(Comment));
  }

  deleteComment(parameters: {
    user_id: number;
    manga_id: number;
    comment_id: number;
  }): Observable<DeleteResult> {
    const { user_id, manga_id, comment_id } = parameters;
    return from(
      this._commentRepository.delete({
        manga: {
          id: manga_id,
        },
        user: {
          id: user_id,
        },
        id: comment_id,
      }),
    );
  }
}
