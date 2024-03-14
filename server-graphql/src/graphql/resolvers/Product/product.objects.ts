import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
// 
import { Sorting } from '../../../modules/Postgres/enums/Sorting';
import { ProductTypes } from '../../../modules/Postgres/enums/ProductTypes';
import { RequirementInput } from '../graphql.objects';
import { FillSkillsInput } from '../Enemy/enemy.objects';
import { InheritedModel } from 'nestjs-graphql-tools';



// 
@InputType()
export class NewProductInput {
    @Field() title: string;
    @Field() price: number;
    @Field() max_in_slot: number;
    @Field(() => RequirementInput) requirement: RequirementInput;
    @Field(() => [Int]) skills: number[];
    @Field(() => ProductTypes) type: ProductTypes;
}

@InputType()
export class UpdateProductInput {
    @Field(() => Int) product_id: number;
    @Field() title: string;
    @Field() price: number;
    @Field() max_in_slot: number;
    @Field(() => RequirementInput) requirement: RequirementInput;
    @Field(() => FillSkillsInput) skills: FillSkillsInput;
    @Field(() => ProductTypes) type: ProductTypes;
}



// 
@ObjectType()
export class InventoryObject {
    @Field(() => Int) id: number;
    @Field(() => Sorting) sorting: Sorting;
}

@InheritedModel()
@ObjectType()
export class ProductObject {
    @Field(() => Int) id: number;
    @Field() title: string;
    @Field() price: number;
    @Field() max_in_slot: number;
    @Field(() => ProductTypes) product_type: ProductTypes;
    //      requirement_id: number;
    //      inventory_id: number;
}

@ObjectType()
export class InventoryProductObject extends ProductObject {
    @Field(() => Int, { nullable: true }) count_in_all_slots?: number;
    //      inventory_id: number;
    //      product_id: number;
}

@ObjectType()
export class ProductClothObject {
    @Field(() => Int) id: number;
    @Field() product_id: number;
}

@ObjectType()
export class ProductShellObject {
    @Field(() => Int) id: number;
    @Field() product_id: number;
}

@ObjectType()
export class ProductWeaponObject {
    @Field(() => Int) id: number;
    @Field() product_id: number;
}
