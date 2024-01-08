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
import { NewUserInput } from './graph/new.user.input';
import { UserModel } from './graph/user.model';
import { UserArgs } from './graph/user.args';
import { UserService } from './user.service';

const pubSub = new PubSub();

@Resolver((of) => UserModel)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query((returns) => UserModel) // , { name: 'user' }) //
    async getUser(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<UserModel> {
        const user = this.userService.findOneById(id);
        if (!user) throw new NotFoundException(id);
        return user;
    }

    @Query((returns) => [UserModel]) // , { name: 'users' }) //
    getUsers(@Args() userArgs: UserArgs): Promise<UserModel[]> {
        return this.userService.findAll(userArgs);
    }

    @Mutation((returns) => UserModel)
    async addUser(
        @Args('newUserData') userInput: NewUserInput,
    ): Promise<UserModel> {
        const user = await this.userService.create(userInput);
        pubSub.publish('userAdded', { userAdded: user });
        return user;
    }

    @Mutation((returns) => Boolean)
    async removeUser(@Args('id', { type: () => Int }) id: number) {
        return this.userService.remove(id);
    }

    @Subscription((returns) => UserModel)
    userAdded() {
        return pubSub.asyncIterator('userAdded');
    }
}
