import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//
import { NewPhotoInput } from './graph/new.photo.input';
import { PhotoModel } from './graph/photo.model';
import { PhotoArgs } from './graph/photo.args';
import { Photo } from '../Postgres/Entity/Photo';
import { User } from '../Postgres/Entity/User';

//
@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo, 'postgres_db')
        private photoRepository: Repository<Photo>,
        @InjectRepository(User, 'postgres_db')
        private usersRepository: Repository<User>,
    ) {
        this.usersRepository
            .find()
            .then((users) => console.log('PhotoService.USERS === ', users));
    }

    async create(data: NewPhotoInput): Promise<PhotoModel> {
        const photo = new Photo();
        photo.user = await this.usersRepository.findOneBy({ id: data.userId });
        const newPhoto = await this.photoRepository.create(photo);
        console.log('NEW PHOTO === ', newPhoto);
        return newPhoto as PhotoModel;
    }

    async findOneById(id: number): Promise<PhotoModel> {
        const photo = await this.photoRepository.findOneBy({ id: id });
        console.log('PHOTO === ', photo);
        return photo as PhotoModel;
    }

    async findAll(photoArgs: PhotoArgs): Promise<PhotoModel[]> {
        const photos = await this.photoRepository.find();
        console.log('PHOTOS === ', photos);
        return photos as PhotoModel[];
    }

    async remove(id: number): Promise<boolean> {
        const photo = await this.photoRepository.findOneBy({ id: id });
        const result = await this.photoRepository.remove(photo);
        console.log('REMOVE PHOTO === ', result);
        return result ? true : false;
    }
}
