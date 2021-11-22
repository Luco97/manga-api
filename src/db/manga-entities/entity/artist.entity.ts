import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MangaEntity } from './manga.entity';

@Entity({
    name: 'ARTISTA'
})
export class ArtistEntity {

    @PrimaryGeneratedColumn({
        name: 'ID'
    })
    id: number;

    @Column({
        name: 'NAME',
        type: 'varchar',
        length: 35,
        nullable: false
    })
    name: string;

    @Column({
        name: 'DESCRIPTION',
        type: 'varchar',
        length: 250,
        nullable: true
    })
    description: string;

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
        () => MangaEntity, manga => manga.artists,
        {
            nullable: true
        }
    )
    @JoinTable({
        name: 'WRITER',
        joinColumn: {
            name: 'ARTIST_ID',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'MANGA_ID',
            referencedColumnName: 'id'
        }
    })
    mangas: MangaEntity[]
}
