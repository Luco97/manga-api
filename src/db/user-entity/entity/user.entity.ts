import { genSalt, hash } from "bcrypt";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
    name: 'USUARIOS'
})
export class UserEntity {

    constructor( username: string, email: string, password: string) {
        this.username   = username;
        this.email      = email;
        this.password   = password;
    }

    @PrimaryGeneratedColumn({
        name: 'id'
    })
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
        nullable: false
    })
    password: string;

    @Column({
        name: 'ACTIVE',
        type: 'boolean',
        nullable: true
    })
    active: boolean;

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

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(!this.password) return;

        const saltRound: number = 10;
        const bcSaltRound = await genSalt(saltRound);
        this.password = await hash(this.password, bcSaltRound);
    }
}
