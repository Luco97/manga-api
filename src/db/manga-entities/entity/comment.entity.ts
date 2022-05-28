import { UserEntity } from '@db/user/entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createDate: Date;

  @ManyToOne(() => MangaEntity, {
    nullable: false,
  })
  manga: MangaEntity;

  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  user: UserEntity;
}
