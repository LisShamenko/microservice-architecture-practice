import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
//
import { Photo } from './Entity/Photo';
import { User } from './Entity/User';

@Injectable()
export class PostgresService {
    constructor(
        @InjectRepository(User, 'postgres_db')
        private usersRepository: Repository<User>,
        @InjectRepository(Photo, 'postgres_db')
        private photoRepository: Repository<Photo>,
        @InjectDataSource('postgres_db') private dataSource: DataSource,
    ) {
        this.usersRepository
            .find()
            .then((users) => console.log('USERS === ', users));
    }

    async getTest() {
        //      const user: User = new User('F', 'L', false);
        const user: User = new User();
        user.firstname = 'F';
        user.lastname = 'L';
        user.isActive = false;

        const photos: Photo[] = [];
        for (let i = 0; i < 3; i++) {
            const photo = new Photo();
            photo.user = user;
            photos.push(photo);
        }

        //      await this.dataSource.transaction(async manager => await manager.save(new User('F', 'L', false)));
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(user);
            await queryRunner.manager.save(photos);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            console.log('------------- error = ', e);
        } finally {
            await queryRunner.release();
        }

        return 'OK';
    }
}
