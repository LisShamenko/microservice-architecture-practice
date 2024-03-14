import { Field, Int, InputType, ObjectType, createUnionType } from '@nestjs/graphql';
import { FilterField, SortingField } from 'nestjs-graphql-tools';
// 
import { ActivityPointTypes } from '../../../modules/Postgres/enums/ActivityPointTypes';
import { Vector3Input } from '../graphql.objects';



// 
@InputType()
export class NewMapInput {
    @Field(() => Int) scene_id: number;
    @Field() title: string;
    @Field(() => [Vector3Input]) poins: Vector3Input[];
}

@InputType()
export class SpawnInput {
    @Field() is_player: boolean;
    @Field() is_enemy: boolean;
}

@InputType()
export class TeleportInput {
    @Field(() => Int) next_activity_id: number;
    @Field(() => Int) prev_activity_id: number;
}

@InputType()
export class PointItemInput {
    @Field(() => Int) point_id: number;
    @Field(() => Vector3Input, { nullable: true }) position: Vector3Input;
    @Field(() => ActivityPointTypes, { nullable: true }) type: ActivityPointTypes;
    @Field(() => SpawnInput, { nullable: true }) spawn: SpawnInput;
    @Field(() => TeleportInput, { nullable: true }) teleport: TeleportInput;
}

@InputType()
export class UpdateMapInput {
    @Field(() => Int) map_id: number;
    @Field() title: string;
    @Field(() => [PointItemInput]) points: PointItemInput[];
}



// 
@InputType()
export class MapFilter {
    @FilterField(() => String, { sqlExp: 't.scene_id' }) custom_scene_id: number;
    @FilterField(() => String, { sqlExp: 'concat(t.title, \'-\', t.scene_id)' }) full_name: string;
}

@InputType()
export class MapSorting {
    @SortingField() id: number;
    @SortingField() scene_id: number;
    @SortingField({ sqlExp: 'mp.story_points' }) title: string;
}



// 
@ObjectType()
export class MapObject {
    @Field(() => Int) id: number;
    @Field() title: string;
    // 
    @FilterField({ exclude: true })
    @SortingField({ exclude: true })
    @Field({ nullable: true })
    scene_id?: number;
}

@ObjectType()
export class MapPointObject {
    @Field(() => Int) point_id: number;
    @Field(() => Int, { nullable: true }) activity_id: number;
    @Field() map_id: number;
    @Field(() => [Number]) position: number[];
    @Field(() => ActivityPointTypes) pointType: ActivityPointTypes;
}

@ObjectType()
export class TeleportObject {
    @Field(() => Int) id: number;
    @Field(() => Int) activity_id: number;
    @Field() next_id: number;
    @Field() prev_id: number;
}

@ObjectType()
export class SpawnObject {
    @Field(() => Int) id: number;
    @Field(() => Int) activity_id: number;
    @Field() is_player: boolean;
    @Field() is_enemy: boolean;
}

export const ActivityPointUnion = createUnionType({
    name: 'ActivityPointUnion',
    types: () => [TeleportObject, SpawnObject] as const,
    resolveType: (value) => {
        console.log('--- OBJ = ', value);
        if (value['__UnionDescriminator__'] === ActivityPointTypes.spawn) {
            return SpawnObject;
        }
        else if (value['__UnionDescriminator__'] === ActivityPointTypes.teleport) {
            return TeleportObject;
        }
    },
});
