import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
// 
import { EnemyTypes } from '../../../modules/Postgres/enums/EnemyTypes';
import { PropertiesInput } from '../graphql.objects';



// 
@InputType()
export class ProductItemInput {
    @Field(() => Int) product_id: number;
    @Field(() => Int) count_in_slots: number;
}

@InputType()
export class FillProductsInput {
    @Field(() => [ProductItemInput], { nullable: true }) add: ProductItemInput[];
    @Field(() => [ProductItemInput], { nullable: true }) remove: ProductItemInput[];
}

@InputType()
export class FillSkillsInput {
    @Field(() => [Int], { nullable: true }) add?: number[];
    @Field(() => [Int], { nullable: true }) remove?: number[];
}

@InputType()
export class NewEnemyInput {
    @Field() nickname: string;
    @Field(() => Int) level_template_id: number;
    @Field(() => EnemyTypes) enemy_type: EnemyTypes;
    @Field(() => PropertiesInput, { nullable: true }) delta_properties: PropertiesInput;
    @Field(() => FillProductsInput, { nullable: true }) products: FillProductsInput;
    @Field(() => FillSkillsInput, { nullable: true }) skills: FillSkillsInput;
}

@InputType()
export class UpdateEnemyInput {
    @Field(() => Int) enemy_id: number;
    @Field({ nullable: true }) nickname: string;
    @Field(() => Int, { nullable: true }) reset_template_id: number;
    @Field(() => EnemyTypes, { nullable: true }) enemy_type: EnemyTypes;
    @Field(() => PropertiesInput, { nullable: true }) delta_properties: PropertiesInput;
    @Field(() => FillProductsInput, { nullable: true }) products: FillProductsInput;
    @Field(() => FillSkillsInput, { nullable: true }) skills: FillSkillsInput;
}



// 
@ObjectType()
export class EnemyObject {
    @Field(() => Int) id: number;
    @Field(() => EnemyTypes) enemy_type: EnemyTypes;
    @Field() nickname: string;
}
