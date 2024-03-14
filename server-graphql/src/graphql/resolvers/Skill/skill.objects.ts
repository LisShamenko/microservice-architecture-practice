import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { RequirementInput } from '../graphql.objects';



// 
@InputType()
export class NewSkillInput {
    @Field() title: string;
    @Field(() => Int) parent_skill_id: number;
    @Field(() => RequirementInput) requirement: RequirementInput;
}

@InputType()
export class UpdateSkillInput {
    @Field(() => Int) skill_id: number;
    @Field() title: string;
    @Field(() => Int) parent_skill_id: number;
    @Field(() => RequirementInput) requirement: RequirementInput;
}



// 
@ObjectType()
export class SkillObject {
    @Field(() => Int) id: number;
    @Field() title: string;
    //      requirement_id: number;
    //      parent_skill_id: number;
}
