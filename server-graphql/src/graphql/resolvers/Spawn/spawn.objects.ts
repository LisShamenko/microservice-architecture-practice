import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';



// 
@InputType()
export class SpawnWaveInput {
    @Field(() => Int, { nullable: true }) id: number;
    @Field() count: number;
    @Field() spawn_moment: number;
    @Field(() => Int) enemy_id: number;
}

@InputType()
export class NewSpawnScriptInput {
    @Field() title: string;
    @Field(() => [SpawnWaveInput]) waves: SpawnWaveInput[];
}

@InputType()
export class UpdateSpawnScriptInput {
    @Field(() => Int) script_id: number;
    @Field() title: string;
    @Field(() => [SpawnWaveInput]) waves: SpawnWaveInput[];
}



// 
@ObjectType()
export class SpawnScriptObject {
    @Field(() => Int) id: number;
    @Field() title: string;
}

@ObjectType()
export class SpawnScriptEnemyObject {
    @Field(() => Int) id: number;
    @Field(() => Int) count: number;
    @Field(() => Int) spawn_moment: number;
    @Field(() => Int) enemy_id: number;
}
