import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MangaEntity } from './manga.entity';

@Entity({
    name: 'IDIOMA'
})
export class LanguageEntity {
    
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