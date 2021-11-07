import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
    name: 'USUARIOS'
})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'USERNAME',
        type: 'varchar',
        length: 30,
        nullable: false
    })
    username: string;

    @Column({
        name: 'EMAIL',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    email: string;

    @Column({
        name: 'PASSWORD',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    password: string;

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
}
