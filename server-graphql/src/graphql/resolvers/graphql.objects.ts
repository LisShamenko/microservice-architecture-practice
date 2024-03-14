import { Field, Int, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { InheritedModel } from 'nestjs-graphql-tools';
// 
import { ActivityPointTypes } from '../../modules/Postgres/enums/ActivityPointTypes';
import { Sorting } from '../../modules/Postgres/enums/Sorting';
import { EnemyTypes } from '../../modules/Postgres/enums/EnemyTypes';
import { FileStatus } from '../../modules/Postgres/enums/FileStatus';
import { ProductTypes } from '../../modules/Postgres/enums/ProductTypes';
import { PropertyColumns } from '../../modules/Postgres/enums/PropertyColumns';



// 
registerEnumType(ActivityPointTypes, { name: 'ActivityPointTypes' });
registerEnumType(EnemyTypes, { name: 'EnemyTypes' });
registerEnumType(FileStatus, { name: 'FileStatus' });
registerEnumType(ProductTypes, { name: 'ProductTypes' });
registerEnumType(PropertyColumns, { name: 'PropertyColumns' });
registerEnumType(Sorting, { name: 'Sorting' });



// 
@ObjectType()
@InheritedModel()
export class BaseDTO {
    @Field(() => Int) id: number;
    @Field(() => Date) created_at: Date;
    @Field(() => Date) updated_at: Date;
}

@InputType()
export class Vector3Input {
    @Field(() => Int) x: number;
    @Field(() => Int) y: number;
    @Field(() => Int) z: number;
}

@ObjectType()
export class DeleteResult {
    @Field(() => Int) rows: number;
}



// 
@InputType()
@ObjectType()
@InheritedModel()
export class PropertiesInput {
    @Field(() => Int, { nullable: true }) strength: number;
    @Field(() => Int, { nullable: true }) endurance: number;
    @Field(() => Int, { nullable: true }) intelligence: number;
    @Field(() => Int, { nullable: true }) agility: number;
    @Field(() => Int, { nullable: true }) fire_weapons: number;
    @Field(() => Int, { nullable: true }) melee_weapons: number;
    @Field(() => Int, { nullable: true }) throwing: number;
    @Field(() => Int, { nullable: true }) doctor: number;
    @Field(() => Int, { nullable: true }) sneak: number;
    @Field(() => Int, { nullable: true }) steal: number;
    @Field(() => Int, { nullable: true }) traps: number;
    @Field(() => Int, { nullable: true }) science: number;
    @Field(() => Int, { nullable: true }) repair: number;
    @Field(() => Int, { nullable: true }) barter: number;
}



// 
@InputType()
export class RequirementInput extends PropertiesInput {
    @Field() title: string;
    @Field(() => Int) player_level: number;
}

// 
@ObjectType()
export class RequirementObject extends PropertiesInput {
    @Field(() => Int) id: number;
    @Field() title: string;
    @Field(() => Int) player_level: number;
}

@ObjectType()
export class PlayerPropertyObject extends PropertiesInput {
    @Field(() => Int) id: number;
}
