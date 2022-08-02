import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'ROLES',
})
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID_ROLE',
    comment: 'ID de un rol, que este comentario exista en algun lado',
  })
  uuid: string;

  @Column({
    name: 'ROLE_NAME',
    nullable: false,
    // select: false,
  })
  role_name: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
