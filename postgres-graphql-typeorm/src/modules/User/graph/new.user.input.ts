import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class NewUserInput {
    @Field()
    @MaxLength(50)
    firstname: string;

    @Field()
    @MaxLength(50)
    lastname: string;
}
