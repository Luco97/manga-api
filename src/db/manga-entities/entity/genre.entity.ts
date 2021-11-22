import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MangaEntity } from './manga.entity';

@Entity({
    name: 'GENERO'
})
export class GenreEntity {

    @PrimaryGeneratedColumn({
        name: 'ID'
    })
    id: number;

    @Column({
        name: 'TAG',
        type: 'varchar',
        length: 30,
        nullable: false
    })
    tag: string;

    @CreateDateColumn({
        name: 'CREATED_AT',
        type: 'timestamp'
    })
    createDate: Date;

    @UpdateDateColumn({
        name: 'UPDATED_AT',
        type: 'timestamp'
    })
    updateDate: Date;

    @ManyToMany(
        () => MangaEntity, manga => manga.genres,
        {
            nullable: true
        }
    )
    @JoinTable({
        name: 'CATEGORY',
        joinColumn: {
            name: 'GENRE_ID',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'MANGA_ID',
            referencedColumnName: 'id'
        }
    })
    mangas: MangaEntity[];
}
