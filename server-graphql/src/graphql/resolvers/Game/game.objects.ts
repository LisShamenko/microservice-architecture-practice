import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';



//
@InputType()
export class NewGameInput {
    @Field(() => Int) map_id: number;
    @Field(() => Int) spawn_script_id: number;
    @Field(() => Int) owner_player_id: number;
}

@InputType()
export class UpdateGameInput {
    @Field(() => Int) game_id: number;
    @Field(() => Int) player_id: number;
    @Field() to_connect: boolean;
}



// 
export enum UpdateGameResult {
    inserted = 'inserted',
    alreadyInserted = 'alreadyInserted',
    deleted = 'deleted',
    alreadyDeleted = 'alreadyDeleted',
}

registerEnumType(UpdateGameResult, { name: 'UpdateGameResult' });



// 
@ObjectType()
export class GameObject {
    @Field(() => Int) id: number;
}

@ObjectType()
export class UpdateGameOutput {
    @Field(() => UpdateGameResult) result: UpdateGameResult;
    //
    setResult(result: UpdateGameResult) {
        this.result = result;
        return this;
    }
}
