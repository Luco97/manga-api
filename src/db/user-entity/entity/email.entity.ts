import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'VERIFY_USER',
})
export class EmailEntity {
  constructor() {}

  @PrimaryGeneratedColumn('uuid', {
    name: 'ID_ROLE',
    comment: 'ID de un rol, que este comentario exista en algun lado',
  })
  uuid: string;

  @Column({
    name: 'CONFIRMATION',
    nullable: false,
    default: false,
    // select: false,
  })
  activated: boolean;
}
