import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
// 
import { PropertyColumns } from '../../../modules/Postgres/enums/PropertyColumns';
import { FillProductsInput, FillSkillsInput } from '../Enemy/enemy.objects';
import { PropertiesInput } from '../graphql.objects';



//
@InputType()
export class LevelEffectInput {
    @Field(() => Int) count_matches: number;
    @Field() is_equipment: boolean;
    @Field(() => PropertyColumns) property_column: PropertyColumns;
    @Field(() => Int) delta_value: number;
}

@InputType()
export class NewPlayerInput {
    @Field() login: string;
    @Field() password: string;
    @Field() firstname: string;
    @Field() secondname: string;
    @Field() thirdname: string;
    @Field() email: string;
    @Field(() => Int) level_template_id: number;
    @Field(() => PropertiesInput) delta_properties: PropertiesInput;
    @Field(() => FillProductsInput) products: FillProductsInput;
    @Field(() => FillSkillsInput) skills: FillSkillsInput;
    @Field(() => [LevelEffectInput]) effects?: LevelEffectInput[];
}

@InputType()
export class UpdatePlayerInput {
    @Field(() => Int) player_id: number;
    @Field() firstname: string;
    @Field() secondname: string;
    @Field() thirdname: string;
    @Field() email: string;
    @Field(() => PropertiesInput) delta_properties: PropertiesInput;
    @Field(() => FillProductsInput) products: FillProductsInput;
    @Field(() => FillSkillsInput) skills: FillSkillsInput;
    @Field(() => [LevelEffectInput]) add_effects: LevelEffectInput[];
    @Field(() => [Int]) remove_effects: number[];
}



// 
@ObjectType()
export class PlayerObject {
    @Field(() => Int) id: number;
    @Field() login: string;
    @Field() password: string;
    @Field() firstname: string;
    @Field() secondname: string;
    @Field() thirdname: string;
    @Field() email: string;
    //      inventory_id: number;
    //      properties_id: number;
    //      level_template_id: number;
}

@ObjectType()
export class LevelEffectObject {
    @Field(() => Int) id: number;
    @Field(() => Int) count_matches: number;
    @Field() is_equipment: boolean;
    @Field(() => PropertyColumns) property_column: PropertyColumns;
    @Field(() => Int) delta_value: number;
    //      player_id: number;
}
