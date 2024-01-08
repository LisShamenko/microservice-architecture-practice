import { Field, Int, ObjectType } from '@nestjs/graphql';
//
import { UserModel } from 'src/modules/User/graph/user.model';

@ObjectType({ description: 'photos' })
export class PhotoModel {
    @Field((type) => Int)
    id: number;
    @Field((type) => UserModel)
    user: UserModel;
}
