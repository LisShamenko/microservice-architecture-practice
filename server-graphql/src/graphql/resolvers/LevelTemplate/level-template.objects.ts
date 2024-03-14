import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
//
import { PropertiesInput } from '../graphql.objects';
import { FillProductsInput, FillSkillsInput, ProductItemInput } from '../Enemy/enemy.objects';



//
@InputType()
export class NewLevelTemplateInput {
    @Field() title: string;
    @Field(() => PropertiesInput) properties: PropertiesInput;
    @Field(() => [ProductItemInput]) products: ProductItemInput[];
    @Field(() => [Int]) skills: number[];
}

@InputType()
export class UpdateLevelTemplateInput {
    @Field(() => Int) template_id: number;
    @Field() title: string;
    @Field(() => PropertiesInput) delta_properties: PropertiesInput;
    @Field(() => FillProductsInput) products: FillProductsInput;
    @Field(() => FillSkillsInput) skills: FillSkillsInput;
}



// 
@ObjectType()
export class LevelTemplateObject {
    @Field(() => Int) id: number;
    @Field() title: string;
    @Field() coins: number;
}
