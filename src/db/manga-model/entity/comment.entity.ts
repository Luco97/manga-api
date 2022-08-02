import { UserEntity } from '@db/user/entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MangaEntity } from './manga.entity';

@Entity({
  name: 'Comments',
})
export class CommentEntity {
  @PrimaryGeneratedColumn({
    name: 'comment_ID',
  })
  id: number;

  @Column({
    name: 'COMMENT',
    nullable: false,
    type: 'varchar',
  })
  comment: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @ManyToOne(() => MangaEntity, {
    nullable: false,
  })
  manga: MangaEntity;

  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  user: UserEntity;
}
