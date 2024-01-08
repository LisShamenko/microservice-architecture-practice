import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewPhotoInput {
    @Field((type) => Int)
    userId: number;
}
