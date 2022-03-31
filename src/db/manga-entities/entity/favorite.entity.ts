import { UserEntity } from '@db/user/entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MangaEntity } from './manga.entity';

@Entity({
  name: 'FAVORITE_DATE',
})
export class FavoriteEntity {
  constructor(date: Date) {}

  @PrimaryGeneratedColumn({
    name: 'ID',
  })
  id: number;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
  })
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.favorites)
  user: UserEntity;

  @ManyToOne(() => MangaEntity, (manga) => manga.favorites)
  manga: MangaEntity;
}
