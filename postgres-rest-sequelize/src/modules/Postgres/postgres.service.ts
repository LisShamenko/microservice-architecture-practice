import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository, Sequelize } from 'sequelize-typescript';
//
import { Photo } from './Entity/Photo';
import { User } from './Entity/User';

@Injectable()
export class PostgresService {
    constructor(@InjectModel(User) private model: typeof User) {
        //this.usersRepository.find().then((res) => console.log('--- ', res));
        this.model
            .findAll<User>()
            .then((users) => console.log('USERS === ', users));
    }

    async getTest() {
        // //      const user: User = new User('F', 'L', false);
        // const user: User = new User();
        // user.firstname = 'F';
        // user.lastname = 'L';
        // user.isActive = false;

        // const photos: Photo[] = [];
        // for (let i = 0; i < 3; i++) {
        //     const photo = new Photo();
        //     photo.user = user;
        //     photos.push(photo);
        // }

        // //      await this.dataSource.transaction(async manager => await manager.save(new User('F', 'L', false)));
        // const queryRunner = this.dataSource.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();

        // try {
        //     await queryRunner.manager.save(user);
        //     await queryRunner.manager.save(photos);
        //     await queryRunner.commitTransaction();
        // } catch (e) {
        //     await queryRunner.rollbackTransaction();
        //     console.log('------------- error = ', e);
        // } finally {
        //     await queryRunner.release();
        // }

        return 'OK';
    }
}
