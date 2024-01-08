import { Field, Int, ObjectType } from '@nestjs/graphql';
//
import { PhotoModel } from 'src/modules/Photo/graph/photo.model';

@ObjectType({ description: 'users' })
export class UserModel {
    @Field((type) => Int)
    id: number;
    @Field()
    firstname: string;
    @Field()
    lastname: string;
    @Field()
    isActive: boolean;

    @Field((type) => [PhotoModel])
    photos: PhotoModel[];
}
