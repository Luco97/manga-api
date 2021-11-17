import { PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, Entity } from 'typeorm';
import { UserEntity } from '../../user-entity/entity/user.entity';

@Entity({
    name: 'MANGA',
    orderBy: {
        'CREATED_AT': 'DESC'
    }
})
export class MangaEntity {  
    @PrimaryGeneratedColumn({
        name: 'ID'
    })
    id: number;

    @Column({
        name: 'TITLE',
        type: 'varchar',
        length: 150,
        update: false,
        nullable: false
    })
    title: string;

    @Column({
        name: 'NUMBER_OF_PAGES',
        type: 'int',
        update: false,
        nullable: false
    })
    number_of_pages: number;

    @CreateDateColumn({
        name: 'CREATED_AT',
        type: 'timestamp'
    })
    created_at: Date;

    @ManyToMany(
        (() => UserEntity),{
            nullable: true
        }
    )
    @JoinTable({
        name: 'FAVORITES',
        joinColumn: {
            name: 'MANGA_ID',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'USER_ID',
            referencedColumnName: 'id'
        }
    })
    users: UserEntity[];
}
