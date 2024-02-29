import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
// 
import { Requirement } from './Requirement';



// 
@Schema()
export class Skill {
    _id: Types.ObjectId;
    @Prop() title: string;
    @Prop() requirements: Requirement;
    @Prop({ type: Types.ObjectId, ref: Skill.name })
    parent_skill_id: Types.ObjectId | null;
    // 
    parent_skill: Skill;
}

// 
export const SkillSchema = SchemaFactory.createForClass(Skill);

SkillSchema.virtual('parent_skill', {
    ref: Skill.name,
    localField: 'parent_skill_id',
    foreignField: '_id',
})

export const SkillModel = models['Skill'] || model<Skill>('Skill', SkillSchema);
export type SkillDocument = HydratedDocument<Skill>;
