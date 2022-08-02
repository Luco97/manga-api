import { MangaEntity } from '@db/manga/entity';
import { genSalt, hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmailEntity } from './email.entity';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'USUARIOS',
})
export class UserEntity {
  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'USERNAME',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  username: string;

  @Column({
    name: 'EMAIL',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'PASSWORD',
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
    select: false,
  })
  createDate: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
    select: false,
  })
  updateDate: Date;

  @ManyToMany(() => MangaEntity, (manga) => manga.users, {
    nullable: true,
  })
  mangas: MangaEntity[];

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: RoleEntity;

  @OneToOne(() => EmailEntity)
  @JoinColumn()
  activation: EmailEntity;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    const saltRound: number = 10;
    const bcSaltRound = await genSalt(saltRound);
    this.password = await hash(this.password, bcSaltRound);
  }
}
