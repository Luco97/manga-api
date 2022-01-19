import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MangaEntity } from './manga.entity';

@Entity({
    name: 'IDIOMA'
})
export class LanguageEntity {

    constructor( language: string, country: string) {
        this.language   = language;
        this.country    = country;
    }
    
    @PrimaryGeneratedColumn({
        name: 'ID',
        type: 'int'
    })
    id: number;

    @Column({
        name: 'LANGUAGE',
        type: 'varchar',
        length: 30,
        nullable: false
    })
    language: string;

    @Column({
        name: 'COUNTRY',
        type: 'varchar',
        length: 30,
        nullable: false
    })
    country: string;

    @CreateDateColumn({
        name: 'CREATED_AT',
        type: 'timestamp',
        select: false
    })
    @Exclude()
    createDate: Date;
    
    @UpdateDateColumn({
        name: 'UPDATED_AT',
        type: 'timestamp',
        select: false
    })
    @Exclude()
    updateDate: Date;

    @ManyToMany(
        () => MangaEntity, manga => manga.languages,
        {
            nullable: true
        }
    )
    @JoinTable({
        name: 'TRANSLATE',
        joinColumn: {
            name: 'LANGUAGE_ID',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'MANGA_ID',
            referencedColumnName: 'id'
        }
    })
    mangas: MangaEntity[];
}
