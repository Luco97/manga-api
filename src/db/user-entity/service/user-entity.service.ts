import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';


import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserEntityService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<UserEntity[]> {
        const data = await this.userRepository.find();
        return data;
    }

    async findOneByMail(email: string): Promise<UserEntity> {
        const data: UserEntity = await this.userRepository.findOneOrFail({},{
            where: {
                email
            },

        })
        return data
    }

    async findOneByMail2(email: string): Promise<UserEntity> {
        const data: UserEntity = await this.userRepository.findOne({}, {
            where: {
                email
            }
        })
        return data;
    }

    async findOne(id: number): Promise<UserEntity> {
        const data: UserEntity = await this.userRepository.findOne(id);
        if(!data) throw new NotFoundException('No se puede encontrar usuario');
        return data;
    }

    async findBy(option: FindOneOptions<UserEntity>): Promise<UserEntity[]> {
        const data: UserEntity[] = await this.userRepository.find(option)
        //if(!data) throw new NotFoundException('No se puede encontrar usuario');
        return data;
    }

    async create( user: UserEntity) {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    async save( user: UserEntity) {
        return await this.userRepository.save(user);
    }

    async updateStatus( user: UserEntity) {
        user.active = !user.active;
        this.userRepository.save(user);
    }

}
