import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//
import { NewUserInput } from './graph/new.user.input';
import { User } from '../Postgres/Entity/User';
import { UserModel } from './graph/user.model';
import { UserArgs } from './graph/user.args';
import { Photo } from '../Postgres/Entity/Photo';
import { PhotoModel } from '../Photo/graph/photo.model';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Photo, 'postgres_db')
        private photoRepository: Repository<Photo>,
        @InjectRepository(User, 'postgres_db')
        private usersRepository: Repository<User>,
    ) {
        this.usersRepository
            .find()
            .then((users) => console.log('UserService.USERS === ', users));
    }

    async create(data: NewUserInput): Promise<UserModel> {
        const user = new User();
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        const newUser = await this.usersRepository.create(user);
        console.log('NEW USER === ', newUser);
        return newUser as UserModel;
    }

    async findOneById(id: number): Promise<UserModel> {
        const user = (await this.usersRepository.findOneBy({
            id: id,
        })) as UserModel;
        const photos = await this.photoRepository.findBy({ user: { id: id } });
        user.photos = photos as PhotoModel[];
        console.log('USER === ', user);
        return user as UserModel;
    }

    async findAll(userArgs: UserArgs): Promise<UserModel[]> {
        const users = await this.usersRepository.find();
        console.log('USERS === ', users);
        return users as UserModel[];
    }

    async remove(id: number): Promise<boolean> {
        const user = await this.usersRepository.findOneBy({ id: id });
        const result = await this.usersRepository.remove(user);
        console.log('REMOVE USER === ', result);
        return result ? true : false;
    }
}
