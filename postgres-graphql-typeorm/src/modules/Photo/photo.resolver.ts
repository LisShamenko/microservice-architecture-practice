import { NotFoundException } from '@nestjs/common';
import {
    Args,
    Int,
    Mutation,
    Query,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
//
import { NewPhotoInput } from './graph/new.photo.input';
import { PhotoModel } from './graph/photo.model';
import { PhotoArgs } from './graph/photo.args';
import { PhotoService } from './photo.service';

const pubSub = new PubSub();

@Resolver((of) => PhotoModel)
export class PhotoResolver {
    constructor(private readonly photoService: PhotoService) {}

    @Query((returns) => PhotoModel) // { name: 'photo' }) //
    async getPhoto(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<PhotoModel> {
        const photo = this.photoService.findOneById(id);
        if (!photo) throw new NotFoundException(id);
        return photo;
    }

    @Query((returns) => [PhotoModel]) // , { name: 'photos' }) //
    getPhotos(@Args() photoArgs: PhotoArgs): Promise<PhotoModel[]> {
        return this.photoService.findAll(photoArgs);
    }

    @Mutation((returns) => PhotoModel)
    async addPhoto(
        @Args('newPhotoData') photoInput: NewPhotoInput,
    ): Promise<PhotoModel> {
        const photo = await this.photoService.create(photoInput);
        pubSub.publish('photoAdded', { photoAdded: photo });
        return photo;
    }

    @Mutation((returns) => Boolean)
    async removePhoto(@Args('id', { type: () => Int }) id: number) {
        return this.photoService.remove(id);
    }

    @Subscription((returns) => PhotoModel)
    photoAdded() {
        return pubSub.asyncIterator('photoAdded');
    }
}
