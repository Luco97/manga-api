import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entity/comment.entity';

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
  }): Promise<[CommentEntity[], number]> {
    const { manga_id, take, skip } = parameters;
    return this._commentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'culero')
      .innerJoin('comment.manga', 'manguita', 'manguita.id = :manga_id', { manga_id })
      .orderBy('comment.created_at', 'DESC')
      .take(take)
      .skip(skip * take)
      .getManyAndCount();
  }

  postComment(parameters: {
    manga_id: number;
    user_id: number;
    comment: string;
  }): Promise<CommentEntity> {
    const { manga_id, user_id, comment } = parameters;
    const Comment = this._commentRepository.create({
      manga: { id: manga_id },
      user: { id: user_id },
      comment,
    });
    return this._commentRepository.save(Comment);
  }

  deleteComment(comment_id: number) {
    return this._commentRepository.delete(comment_id);
  }
}
