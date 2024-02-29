import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
//
import { EnemyTypes } from '../enums/EnemyTypes';
import { Inventory } from './Inventory';
import { PlayerProperty } from './PlayerProperty';
import { LevelTemplate } from './LevelTemplate';



//
@Schema()
export class Enemy {
    _id: Types.ObjectId;
    @Prop() nickname: string;
    @Prop() enemy_type: EnemyTypes;
    //
    @Prop() inventory: Inventory;
    @Prop() properties: PlayerProperty;
    @Prop() skills: string[];
    //
    @Prop({ type: Types.ObjectId, ref: LevelTemplate.name })
    level_template_id: Types.ObjectId;
    // 
    level_template: LevelTemplate;
}

// 
export const EnemySchema = SchemaFactory.createForClass(Enemy);

EnemySchema.virtual('level_template', {
    ref: LevelTemplate.name,
    localField: 'level_template_id',
    foreignField: '_id',
})

export const EnemyModel = models['Enemy'] || model<Enemy>(
    'Enemy', EnemySchema
);
export type EnemyDocument = HydratedDocument<Enemy>;
