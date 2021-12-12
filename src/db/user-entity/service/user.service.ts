import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';


import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<UserEntity[]> {
        const data = await this.userRepository.find();
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

}
